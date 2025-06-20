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


/** SWAGGER DOCS
 * @swagger
 * /api/merchants:
 *   get:
 *     summary: Get all merchants
 *     description: |
 *       Returns a list of all supported food merchants. Each merchant includes:
 *       - merchant_id (integer)
 *       - name (string)
 *       - location (string or null)
 *       - contact_number (string or null)
 *       - image_url (string)
 *     tags: [Merchants]
 *     responses:
 *       200:
 *         description: List of merchants
 *         content:
 *           application/json:
 *             example:
 *               - merchant_id: 1
 *                 name: Braek
 *                 location: Basement
 *                 contact_number: 91234567
 *                 image_url: https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fastjobs.sg%2Fsingapore-jobs%2F%3Fcoyid%3D204605&psig=AOvVaw3cpA1bdzwgZybei93q9BOz&ust=1748849862598000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjWy8rbz40DFQAAAAAdAAAAABAE
 *               - merchant_id: 5
 *                 name: Koufu
 *                 location: null
 *                 contact_number: null
 *                 image_url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FKoufu_%2528company%2529&psig=AOvVaw29E5Tk6cwedaIOtkli0Q2_&ust=1748850040947000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjd9KLcz40DFQAAAAAdAAAAABAe"
*/
/**
 * GET /api/merchants
 * Fetches all merchants with basic public fields.
 */
export const getAllMerchants = async (req, res, next) => {
  try {
    const merchants = await getAllMerchantsOrThrow();
    res.json(merchants);
  } catch (err) {
    next(err);
  }
};

/** SWAGGER DOCS
 * @swagger
 * /api/merchants/{id}:
 *   get:
 *     summary: Get merchant by ID
 *     description: |
 *       Retrieves a single merchant using their ID. The response includes:
 *       - name (string)
 *       - location (string)
 *       - contact_number (string|null)
 *       - image_url (string)
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Merchant ID
 *     responses:
 *       200:
 *         description: Merchant details
 *         content:
 *           application/json:
 *             example:
 *               name: Braek
 *               location: Basement
 *               contact_number: 91234567
 *               image_url: https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fastjobs.sg%2Fsingapore-jobs%2F%3Fcoyid%3D204605&psig=AOvVaw3cpA1bdzwgZybei93q9BOz&ust=1748849862598000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjWy8rbz40DFQAAAAAdAAAAABAE
 *       404:
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Merchant with ID 1 does not exist"
 *               code: "NOT_FOUND_MERCHANT"
 */
/**
 * GET /api/merchants/:id
 * Fetches a specific merchant by ID.
 */
export const getMerchant = async (req, res, next) => {
  try {
    const { id: merchantId } = req.params;
    const merchants = await getMerchantByIdOrThrow(merchantId, 'name, location, contact_number, image_url');
    res.json(merchants);
  } catch (err) {
    next(err);
  }
};


/** SWAGGER DOCS
 * @swagger
 * /api/merchants/{id}/menu:
 *   get:
 *     summary: Get menu for a specific merchant
 *     description: |
 *       Returns a list of all menu items offered by the merchant. Each item includes:
 *       - menu_item_id (integer)
 *       - name (string)
 *       - price_cents (integer)
 *       - type (string|null)
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Merchant ID
 *     responses:
 *       200:
 *         description: Menu items
 *         content:
 *           application/json:
 *             example:
 *               - menu_item_id: 1
 *                 name: Chicken Rice
 *                 price_cents: 500
 *                 type: "main"
 *       404:
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Merchant with ID 1 does not exist"
 *               code: "NOT_FOUND_MERCHANT"
 */
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


/** SWAGGER DOCS
 * @swagger
 * /api/merchants:
 *   post:
 *     summary: Add a new merchant
 *     description: |
 *       Creates a new merchant with the provided details. All fields are required.
 *     tags: [Merchants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location, contact_number, image_url, payout_frequency]
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               contact_number:
 *                 type: string
 *               image_url:
 *                 type: string
 *               payout_frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *           example:
 *             name: "TESTING HEHE"
 *             location: "CONNEX"
 *             contact_number: "98765432"
 *             image_url: "https://cdn.example.com/testing.png"
 *             payout_frequency: "daily"
 *     responses:
 *       201:
 *         description: Merchant created successfully
 *         content:
 *           application/json:
 *             example:
 *               merchant:
 *                 merchant_id: 8
 *                 name: "TESTING HEHE"
 *                 location: "CONNEX"
 *                 contact_number: "98765432"
 *                 image_url: "https://cdn.example.com/testing.png"
 *                 created_at: "2025-06-19T17:19:40.983147"
 *                 payout_frequency: "daily"
 *       409:
 *         description: Merchant already exists
 *         content:
 *           application/json:
 *             example:
 *               error: "merchant already exists with ID 8"
 *               code: "CONFLICT_MERCHANT"
 */
/**
 * POST /api/merchants
 * Creates a new merchant with the provided data.
 * Expects fields: name, location, contact_number, image_url, payout_frequency (optional, defaults to weekly if absent).
 */
export const addMerchant = async (req, res, next) => {
  try {
    //extract merchant data from request body
    const { name, location, contact_number, image_url, payout_frequency = 'weekly' } = req.body;
    //create merchant
    const newMerchant = await createMerchantOrThrow({ name, location, contact_number, image_url, payout_frequency });
    //return the created merchant
    res.status(201).json({ merchant: newMerchant });
  } catch (err) {
    next(err);
  }
};


/** SWAGGER DOCS
 * @swagger
 * /api/merchants/{id}:
 *   put:
 *     summary: Update a merchant's details
 *     description: |
 *       Updates the specified merchant’s information.
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the merchant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               contact_number:
 *                 type: string
 *               image_url:
 *                 type: string
 *               payout_frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *           example:
 *             name: "update merchant documentation"
 *             location: "CONNEX"
 *             contact_number: "98765432"
 *             image_url: "https://cdn.example.com/testing.png"
 *             payout_frequency: "monthly"
 *     responses:
 *       200:
 *         description: Merchant updated successfully
 *         content:
 *           application/json:
 *             example:
 *               merchant:
 *                 merchant_id: 8
 *                 name: "update merchant documentation"
 *                 location: "CONNEX"
 *                 contact_number: "98765432"
 *                 image_url: "https://cdn.example.com/testing.png"
 *                 created_at: "2025-06-19T17:19:40.983147"
 *                 payout_frequency: "monthly"
 *       404:
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Merchant with ID 1 does not exist"
 *               code: "NOT_FOUND_MERCHANT"
 */
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

/** SWAGGER DOCS
 * @swagger
 * /api/merchants/{id}/menu:
 *   post:
 *     summary: Add a new menu item to a merchant
 *     description: |
 *       Adds a new item to the menu of a given merchant. Input fields:
 *       - name (string, required)
 *       - description (string, optional)
 *       - price_cents (integer, required)
 *       - image_url (string, optional)
 *       - is_available (boolean, required)
 *       - type (string, optional)
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Merchant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price_cents, is_available]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fishball Nodle
 *               description:
 *                 type: string
 *                 example: yummy yummy noodles
 *               price_cents:
 *                 type: integer
 *                 example: 580
 *               image_url:
 *                 type: string
 *                 example: https://cdn.example.com/menu/fishball-noodles.jpg
 *               is_available:
 *                 type: boolean
 *                 example: true
 *               type:
 *                 type: string
 *                 example: food
 *     responses:
 *       200:
 *         description: Menu item added
 *         content:
 *           application/json:
 *             example:
 *               menu_item:
 *                 menu_item_id: 49
 *                 merchant_id: 5
 *                 name: Fishball Noodle
 *                 description: yummy yummy noodles
 *                 price_cents: 580
 *                 image_url: https://cdn.example.com/menu/fishball-noodles.jpg
 *                 is_available: true
 *                 type: food
 *       404:
 *         description: Merchant not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Merchant with ID 1 does not exist"
 *               code: "NOT_FOUND_MERCHANT"
 */
/**
 * POST /api/merchants/:id/menu
 * Adds a new menu item to the specified merchant's menu.
 * TODO (future): make sure only authenticated + correct merchant or admin can add items
 */
export const addMenuItem = async (req, res, next) => {
  try {
    const merchantId = req.params.id;
    await getMerchantByIdOrThrow(merchantId); // validate existence

    const { name, description, price_cents, image_url, is_available = true , type} = req.body;
    const newItem = await createMenuItemOrThrow({
      merchant_id: merchantId,
      name,
      description,
      price_cents,
      image_url,
      is_available,
      type
    });

    res.status(201).json({ menu_item: newItem });
  } catch (err) {
    next(err);
  }
};


/** SWAGGER DOCS
 * @swagger
 * /api/merchants/{merchantId}/menu/{menuItemId}:
 *   put:
 *     summary: Update a specific menu item for a merchant
 *     description: |
 *       Updates fields for an existing menu item. Verifies that the menu item belongs to the specified merchant.
 *       Only provided fields will be updated. Fields include:
 *       - name (string)
 *       - description (string|null)
 *       - price_cents (integer)
 *       - image_url (string|null)
 *       - is_available (boolean)
 *       - type (string|null)
 *     tags: [Merchants]
 *     parameters:
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the merchant
 *       - in: path
 *         name: menuItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the menu item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chicken Rice Deluxe
 *               description:
 *                 type: string
 *                 example: Extra chicken + egg
 *               price_cents:
 *                 type: integer
 *                 example: 650
 *               image_url:
 *                 type: string
 *                 example: https://cdn.example.com/images/chicken-rice-deluxe.jpg
 *               is_available:
 *                 type: boolean
 *                 example: true
 *               type:
 *                 type: string
 *                 example: food
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             example:
 *               menu_item:
 *                 menu_item_id: 15
 *                 merchant_id: 4
 *                 name: Chicken Rice Deluxe
 *                 description: Extra chicken + egg
 *                 price_cents: 650
 *                 image_url: https://cdn.example.com/images/chicken-rice-deluxe.jpg
 *                 is_available: true
 *                 type: food
 *       403:
 *         description: Menu item does not belong to specified merchant
 *         content:
 *           application/json:
 *             example:
 *               message: This menu item does not belong to the specified merchant
 *       404:
 *         description: Merchant / Menu Item not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Merchant with ID 1 does not exist"
 *               code: "NOT_FOUND_MERCHANT"
 */
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