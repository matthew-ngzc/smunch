import { supabase } from '../lib/supabaseClient.js';

/**
 * Creates a new order with associated items.
 *
 * @param {object} payload - Order fields:
 *   customer_id (integer),
 *   merchant_id (integer),
 *   delivery_fee_cents (integer),
 *   payment_reference (string),
 *   building (string),
 *   room_type (string),
 *   room_number (string),
 *   delivery_time (timestamp),
 *   order_items: Array<{menu_item_id:number, quantity:number, price_cents:number, customisations?:object}>
 * @returns {Promise<object>} - Created order object including inserted items
 * @throws {Error} - If insertion fails
 */
export async function createOrderOrThrow(payload) {
  const {
    customer_id,
    merchant_id,
    delivery_fee_cents,
    payment_reference,
    building,
    room_type,
    room_number,
    delivery_time,
    order_items
  } = payload;

  // Calculate totals
  const food_amount_cents = order_items.reduce(
    (sum, item) => sum + item.price_cents * item.quantity,
    0
  );
  const total_amount_cents = food_amount_cents + delivery_fee_cents;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      customer_id,
      merchant_id,
      food_amount_cents,
      delivery_fee_cents,
      total_amount_cents,
      payment_reference,
      payment_status: 'pending',
      order_status: 'pending',
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

  // Insert order items
  const itemsPayload = order_items.map(item => ({
    order_id: order.order_id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price_cents: item.price_cents,
    customisations: item.customisations || {},
    notes: item.notes
  }));
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsPayload)
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
    .single();

  if (error) throw error;
  if (!data) {
    const err = new Error(`Order with ID ${orderId} not found`);
    err.status = 404;
    throw err;
  }
  return data;
}

/**
 * Retrieves orders by customer ID with optional status filter.
 *
 * @param {number|string} customerId - Customer (user) ID
 * @param {string[]} [statuses] - Status values to filter by
 * @returns {Promise<object[]>} - Array of order objects
 * @throws {Error} - If query fails
 */
export async function getOrdersByCustomerIdOrThrow(customerId, statuses) {
  let query = supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId);

  if (Array.isArray(statuses) && statuses.length > 0) {
    query = query.in('order_status', statuses);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
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
  if (!data) {
    const err = new Error(`Order with ID ${orderId} does not exist`);
    err.status = 404;
    throw err;
  }
  return data;
}
