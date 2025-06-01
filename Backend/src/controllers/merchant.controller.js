import {
  getAllMerchantsOrThrow,
  getMerchantByIdOrThrow,
  createMerchantOrThrow,
  updateMerchantByIdOrThrow
} from '../models/merchant.model.js';

import {
  getMenuItemsByMerchantIdOrThrow,
  createMenuItemOrThrow,
  getMenuItemByIdOrThrow,
  updateMenuItemByIdOrThrow
} from '../models/menu.model.js';

/**
 * GET /api/merchants
 * Fetches all merchants with basic public fields.
 */
export const getMerchants = async (req, res, next) => {
  try {
    const merchants = await getAllMerchantsOrThrow();
    res.json(merchants);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/merchants/:id/menu
 * Fetches the menu items for a specific merchant.
 */
export const getMenu = async (req, res, next) => {
  try {
    const { id: merchantId } = req.params;
    await getMerchantByIdOrThrow(merchantId); // ensure merchant exists
    const menuItems = await getMenuItemsByMerchantIdOrThrow(merchantId);
    res.json(menuItems);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/merchants
 * Creates a new merchant with the provided data.
 * Expects fields: name, location, contact, image_url, payout_frequency (optional, defaults to weekly if absent).
 */
export const addMerchant = async (req, res, next) => {
  try {
    //extract merchant data from request body
    const { name, location, contact, image_url, payout_frequency = 'weekly' } = req.body;
    //create merchant
    const newMerchant = await createMerchantOrThrow({ name, location, contact, image_url, payout_frequency });
    //return the created merchant
    res.status(201).json({ merchant: newMerchant });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/merchants/:id
 * Updates an existing merchant with the provided data.
 * only updates fields that are provided in the request body.
 */
export const updateMerchant = async (req, res, next) => {
  try {
    const { id: merchantId } = req.params;
    await getMerchantByIdOrThrow(merchantId); // validate existence

    const updatedMerchant = await updateMerchantByIdOrThrow(merchantId, req.body);
    res.json({ merchant: updatedMerchant });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/merchants/:id/menu
 * Adds a new menu item to the specified merchant's menu.
 * TODO (future): make sure only authenticated + correct merchant or admin can add items
 */
export const addMenuItem = async (req, res, next) => {
  try {
    const merchantId = req.params.id;
    await getMerchantByIdOrThrow(merchantId); // validate existence

    const { name, description, price_cents, image_url, is_available = true } = req.body;
    const newItem = await createMenuItemOrThrow({
      merchant_id: merchantId,
      name,
      description,
      price_cents,
      image_url,
      is_available
    });

    res.status(201).json({ menu_item: newItem });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/merchants/:merchantId/menu/:menuItemId
 * Updates an existing menu item for the specified merchant.
 * Checks that the menu item belongs to the specified merchant.
 * only updates fields that are provided in the request body.
 * TODO (future): make sure only authenticated + correct merchant or admin can update items
 */
export const updateMenuItem = async (req, res, next) => {
  try {
    const { merchantId, menuItemId } = req.params;
    const menuItem = await getMenuItemByIdOrThrow(menuItemId);

    //checks that the menu item belongs to the specified merchant
    if (String(menuItem.merchant_id) !== String(merchantId)) {
      return res.status(403).json({ message: 'This menu item does not belong to the specified merchant' });
    }

    const updatedItem = await updateMenuItemByIdOrThrow(menuItemId, req.body);
    res.json({ menu_item: updatedItem });
  } catch (err) {
    next(err);
  }
};