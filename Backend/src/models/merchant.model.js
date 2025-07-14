import { supabase } from '../lib/supabaseClient.js';
import { DuplicateError, NotFoundError } from '../utils/error.utils.js';

/**
 * Retrieves all merchants with basic public fields.
 * Used to display the merchant list to customers or admins.
 *
 * @returns {Promise<object[]>} - An array of merchant objects
 * @throws {Error} - If the query fails
 */
export async function getAllMerchantsOrThrow() {
  const { data, error } = await supabase
    .from('merchants')
    .select('merchant_id, name, location, contact_number, image_url, parent_merchant_id, has_children')
    .order('merchant_id', {ascending: true});

  if (error) throw error;
  return data;
}

/**
 * Retrieves merchants filtered by `parent_merchant_id`.
 *
 * - If `parentId` is `null`, it returns top-level merchants (i.e. where parent_merchant_id IS NULL).
 * - Otherwise, it returns all merchants that are children of the specified parent.
 *
 * Used to fetch stall listings for grouped merchants like Koufu.
 *
 * @param {number|null} parentId - The ID of the parent merchant, or null for top-level
 * @returns {Promise<object[]>} - An array of merchant objects
 * @throws {Error} - If the query fails
 */
export async function getMerchantsByParentIdOrThrow(parentId) {
  let query = supabase
    .from('merchants')
    .select('merchant_id, name, location, contact_number, image_url, parent_merchant_id, has_children')
    .order('merchant_id', { ascending: true });

  if (parentId === null) {
    query = query.is('parent_merchant_id', null);
  } else {
    query = query.eq('parent_merchant_id', parentId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}


/**
 * Fetches a merchant by ID and throws if not found.
 *
 * @param {number} merchantId - Merchant ID
 * @param {string} fields - Comma-separated fields to select (default: 'merchant_id')
 * @returns {Promise<object>} - The merchant object
 * @throws {Error} - If merchant is not found or query fails
 */
export async function getMerchantByIdOrThrow(merchantId, fields = 'merchant_id') {
  const { data, error } = await supabase
    .from('merchants')
    .select(fields)
    .eq('merchant_id', merchantId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw NotFoundError("Merchant", "ID", merchantId);

  return data;
}

/**
 * Fetches a merchant by ID and throws if not found.
 *
 * @param {string} email - Merchant's email
 * @param {string} fields - Comma-separated fields to select (default: 'merchant_id')
 * @returns {Promise<object>} - The merchant object
 * @throws {Error} - If merchant is not found or query 
 * @example
 * const merchant = await getMerchantByEmailOrThrow(email, 'merchant_id,name,email');
 * @output
 * merchant = {
    merchant_id: 5,
    name: "Alice's Cafe",
    email: "alice@example.com"
 * }
 */
export async function getMerchantByEmailOrThrow(email, fields = 'merchant_id') {
  const { data, error } = await supabase
    .from('merchants')
    .select(fields)
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw NotFoundError("Merchant", "email", email);

  return data;
}

/**
 * Updates merchant data for a specific merchant ID. Throws if update fails.
 *
 * @param {number} merchantId - Merchant ID
 * @param {object} updates - Fields to update (name, location, etc.)
 * @returns {Promise<object>} - Updated merchant object
 * @throws {Error} - If update fails
 */
export async function updateMerchantByIdOrThrow(merchantId, updates) {
  const { data, error } = await supabase
    .from('merchants')
    .update(updates)
    .eq('merchant_id', merchantId)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw NotFoundError("Merchant", "ID", merchantId);
  return data;
}

/**
 * Creates a new merchant in the database.
 *
 * @param {object} payload - Merchant fields to insert
 * @returns {Promise<object>} - The created merchant object
 * @throws {Error} - If insertion fails or an identical merchant already exists (all fields match)
 */
export async function createMerchantOrThrow(payload) {
  const { name, location, contact_number, image_url, payout_frequency, email } = payload;

  const { data: existing, error: checkError } = await supabase
    .from('merchants')
    .select('merchant_id')
    .match({ name, location, contact_number, image_url, payout_frequency, email })
    .maybeSingle();

  if (checkError) throw checkError;
  if (existing) throw DuplicateError("Merchant", "ID", existing.merchant_id);


  const { data, error } = await supabase
    .from('merchants')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

