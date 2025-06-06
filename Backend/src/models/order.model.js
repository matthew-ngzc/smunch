import { supabase } from '../lib/supabaseClient.js';

/**
 * Creates a new order.
 *
 * @param {object} payload - Order fields: customer_id (integer), merchant_id (integer), food_amount_cents (integer), delivery_fee_cents (integer), total_amount_cents (integer), payment_reference (string), payment_status (string), order_status (string, optional), customer_confirmed (boolean, optional), customer_confirmed_at (timestamp), building (string), room_type (string), room_number (string), delivery_time (timestamp)
 * @returns {Promise<object>} - Created order object
 * @throws {Error} - If insertion fails
 */
export async function createOrderOrThrow(payload) {
  const { data, error } = await supabase
    .from('orders')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
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
 * Retrieves orders by user ID with optional status filter.
 *
 * @param {number|string} userId - User ID
 * @param {string[]} [statuses] - Optional list of statuses to filter by
 * @returns {Promise<object[]>} - Array of order objects
 * @throws {Error} - If query fails
 */
export async function getOrdersByUserIdOrThrow(userId, statuses) {
  let query = supabase
    .from('orders')
    .select('*')
    .eq('customer_id', userId);

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
 * 
 * For future flexibility. Currently not tested on Postman yet
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
