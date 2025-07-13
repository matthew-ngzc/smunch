import { supabase } from '../lib/supabaseClient.js';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../constants/enums.constants.js';
import { generatePaymentReference } from '../services/payment.service.js';
import { NotFoundError } from '../utils/error.utils.js';
import { getUserByIdOrThrow } from './user.model.js';

/**
 * Creates a new order and its associated items.
 * 
 * Price is fetched server-side from the database to ensure integrity.
 *
 * @param {object} payload - Order details including:
 *   - customer_id (int)
 *   - merchant_id (int)
 *   - delivery_fee_cents (int)
 *   - building (string)
 *   - room_type (string)
 *   - room_number (string)
 *   - delivery_time (timestamp)
 *   - order_items: Array<{menu_item_id, quantity, customisations?, notes?}>
 *
 * @returns {Promise<object>} - Created order object with items
 * @throws {Error} - If insertion or menu lookup fails
 */
export async function createOrderOrThrow(payload) {
  const {
    customer_id,
    merchant_id,
    delivery_fee_cents,
    building,
    room_type,
    room_number,
    delivery_time,
    order_items
  } = payload;

  let food_amount_cents = 0;

  // Step 1: Retrieve prices from DB and build enriched items
  const enrichedItemsRaw = await Promise.all(order_items.map(async (item) => {
    const { data: menuItem, error } = await supabase
      .from('menu_items')
      .select('price_cents')
      .eq('menu_item_id', item.menu_item_id)
      .single();

    if (error || !menuItem) {
      throw new Error(`Invalid menu_item_id: ${item.menu_item_id}`);
    }

    const price_cents = menuItem.price_cents;
    const quantity = item.quantity || 1;

    // Update running total
    food_amount_cents += price_cents * quantity;

    return {
      menu_item_id: item.menu_item_id,
      quantity,
      price_cents,
      customisations: item.customisations || null,
      notes: item.notes || null
    };
  }));

  const total_amount_cents = food_amount_cents + delivery_fee_cents;

  // Step 2: Insert the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      customer_id,
      merchant_id,
      food_amount_cents,
      delivery_fee_cents,
      total_amount_cents,
      payment_status: PAYMENT_STATUSES[0],
      order_status: ORDER_STATUSES[0],
      customer_confirmed: false,
      customer_confirmed_at: null,
      building,
      room_type,
      room_number,
      delivery_time
    }])
    .select()
    .single();

  if (orderError) throw orderError;

  // Step 3: Insert order_items, attaching order_id
  const enrichedItems = enrichedItemsRaw.map(item => ({
    ...item,
    order_id: order.order_id
  }));

  // Step 4: Set Payment Reference
  const payment_reference = await generatePaymentReference(order.order_id);
  const { error: updateError } = await supabase
  .from('orders')
  .update({ payment_reference })
  .eq('order_id', order.order_id);

  if (updateError) throw updateError;
  // Merge it into returned order object
  order.payment_reference = payment_reference;  

  // Step 5: Insert order items
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .insert(enrichedItems)
    .select();

  if (itemsError) throw itemsError;

  return { ...order, items };
}


/**
 * Updates the status of an order by ID.
 *
 * @param {number|string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<object>} - Updated order object
 * @throws {Error} - If update fails or order not found
 */
export async function updateOrderStatusOrThrow(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ order_status: status })
    .eq('order_id', orderId)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw NotFoundError("Order", 'ID', orderId);
  return data;
}

/**
 * Updates the payment status of an order by ID.
 *
 * @param {number|string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<object>} - Updated order object
 * @throws {Error} - If update fails or order not found
 */
export async function updatePaymentStatusOrThrow(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: status })
    .eq('order_id', orderId)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw NotFoundError("Order", 'ID', orderId);
  return data;
}

/**  
 * @deprecated ⚠️ DEPRECATED: Use getFullOrdersByCustomerIdAndStatusOrThrow
 * 
 * Retrieves orders by customer ID with optional status filter.
 *
 * @param {number|string} customerId - Customer (user) ID
 * @param {string[]} [statuses] - Status values to filter by
 * @returns {Promise<object[]>} - Array of order objects
 * @throws {Error} - If query fails
 */
export async function getOrdersByCustomerIdOrThrow(customerId, statuses) {
  // Validate statuses input
  if (statuses && !Array.isArray(statuses)) {
    throw new Error('statuses must be an array of strings');
  }
  // Validate user existence
  await getUserByIdOrThrow(customerId) // throws 404 if user not found

  // Build Query
  let query = supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });;

  // Optionally filter by statuses
  if (Array.isArray(statuses) && statuses.length > 0) {
    query = query.in('order_status', statuses);
  }

  // Query Database
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/** 
 * Retrieves a single order by ID.
 *
 * @param {number|string} orderId - Order ID
 * @returns {Promise<object>} - Order object
 * @throws {Error} - If not found or query fails
 */
export async function getOrderByIdOrThrow(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw NotFoundError("Order", 'ID', orderId);
  return data;
}

/**
 * Retrieves a single order by ID ALONG WITH ITS ITEMS
 *
 * @param {number|string} orderId - Order ID
 * @returns {Promise<object>} - Order object with `items: [...]`
 * @throws {Error} - If not found or query fails
 */
export async function getFullOrderByIdOrThrow(orderId) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) throw NotFoundError("Order", 'ID', orderId);

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('quantity, price_cents, notes, customisations, menu_items(name)')
    .eq('order_id', orderId);

  // Debugging output
  console.log('[DEBUG] raw order_items:', items);

  if (itemsError) throw itemsError;

  return { ...order, items };
}


/**
 * Retrieves a list of full orders (including order items and menu item names) for a given customer.
 * 
 * This function returns detailed order objects containing:
 * - All order fields
 * - Associated order items (quantity, price, notes, customisations)
 * - The name of each related menu item
 * 
 * Supports optional filtering by order status and pagination via limit and offset.
 *
 * @param {number|string} customerId - Customer (user) ID
 * @param {string[]} [statuses=[]] - Optional array of status strings to filter by (e.g. ['created', 'completed'])
 * @param {number} [limit=10] - Maximum number of orders to return
 * @param {number} [offset=0] - Number of records to skip before starting the return set
 * @returns {Promise<object[]>} - Array of full order objects with nested item details
 * @throws {Error} - If the user does not exist or if the query fails
 */
export async function getFullOrdersByCustomerIdAndStatusOrThrow(customerId, statuses = [], limit = 10, offset = 0){
  // Check that customer exists
  await getUserByIdOrThrow(customerId);

  // Build Query
  let query = supabase
    .from('orders')
    .select(`*, order_items (quantity, price_cents, notes, customisations, menu_items(name))`)
    .eq('customer_id', customerId)
    .order('created_at', {ascending: false})
    .range(offset, offset + limit - 1);

  // Filter by Statuses
  if (statuses.length > 0){
    query = query.in('order_status', statuses);
  }

  // Query DB
  const {data, error} = await query;
  if (error) throw error;
  return data;
}

/**
 * Retrieves the total number of orders for a specific customer,
 * optionally filtered by order status.
 *
 * This function does not return any order data — it only returns the count.
 * Uses Supabase's `head: true` to skip fetching rows and `count: 'exact'` for an accurate total.
 *
 * @param {number|string} customerId - ID of the customer whose orders are being counted
 * @param {string[]} [statuses=[]] - Optional array of order statuses to filter by (e.g. ['created', 'completed'])
 * @returns {Promise<number>} - Total number of matching orders
 * @throws {Error} - If the Supabase query fails
 */
export async function getOrderCountByCustomerIdAndStatusOrThrow(customerId, statuses = []){
  let query = supabase
    .from('orders')
    .select('order_id', {count: 'exact', head: true})
    .eq('customer_id', customerId);

    if (statuses.length > 0){
      query = query.in('order_status', statuses)
    }

    const {count, error} = await query;
    if (error) throw error;
    return count;
}

