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
    .select('merchant_id, name, location, contact_number, image_url')
    .order('merchant_id', {ascending: true});

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
  if (!data) throw NotFoundError("Merchant", merchantId);

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
  if (!data) throw NotFoundError("Merchant", merchantId);
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
  if (existing) throw DuplicateError("Merchant", existing.merchant_id);


  const { data, error } = await supabase
    .from('merchants')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

