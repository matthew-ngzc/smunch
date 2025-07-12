import { supabase } from '../lib/supabaseClient.js';
import {
  DuplicateError,
  NotFoundError
} from '../utils/error.utils.js';

/**
 * Retrieves all menu items for a given merchant.
 *
 * @param {number} merchantId - Merchant ID to filter menu items
 * @param {boolean} includeUnavailable - Whether to include unavailable items (default: false)
 * @returns {Promise<object[]>} - Array of menu item objects
 * @throws {Error} - If the query fails
 */
export async function getMenuItemsByMerchantIdOrThrow(merchantId, includeUnavailable = false) {
  let query = supabase
    .from('menu_items')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('type', { ascending: true })  // <- alphabetical by type
    .order('name', { ascending: true }); // <- secondary sort within type

  if (!includeUnavailable) {
    query = query.eq('is_available', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Inserts a new menu item for a specific merchant.
 * Prevents inserting if an identical item already exists.
 *
 * @param {object} payload - Menu item fields (name, price, etc.)
 * @returns {Promise<object>} - The created menu item
 * @throws {Error} - If insertion fails or identical item exists
 */
export async function createMenuItemOrThrow(payload) {
  const {
    merchant_id,
    name,
    description,
    price_cents,
    image_url,
    type,
    availability_status
  } = payload;

  // Check for identical item
  const { data: existing, error: checkError } = await supabase
    .from('menu_items')
    .select('menu_item_id')
    .match({
      merchant_id,
      name,
      description,
      price_cents,
      image_url,
      availability_status,
      type
    })
    .maybeSingle();

  if (checkError) throw checkError;
  if (existing) throw DuplicateError("Menu Item", existing.menu_item_id);

  // Insert if no identical found
  const { data, error } = await supabase
    .from('menu_items')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Retrieves a menu item by its ID and throws if not found.
 *
 * @param {number} menuItemId - Menu item ID
 * @returns {Promise<object>} - The menu item (with merchant_id)
 * @throws {Error} - If the query fails or menu item is not found
 */
export async function getMenuItemByIdOrThrow(menuItemId) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('menu_item_id, merchant_id')
    .eq('menu_item_id', menuItemId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {throw NotFoundError("Menu Item", menuItemId);
  }

  return data;
}

/**
 * Updates a menu item by its ID. Throws if the update fails.
 *
 * @param {number} menuItemId - Menu item ID
 * @param {object} updates - Fields to update (name, price, etc.)
 * @returns {Promise<object>} - The updated menu item
 * @throws {Error} - If update fails
 */
export async function updateMenuItemByIdOrThrow(menuItemId, updates) {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('menu_item_id', menuItemId)
    .select()
    .single();

  if (error) {
    if (error.message.includes('multiple (or no) rows returned')) {
      return next(NotFoundError('Menu Item', menuItemId));
    }
    throw error;
  }
  return data;
}
