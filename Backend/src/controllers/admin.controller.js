import { createMerchantOrThrow } from '../models/merchant.model.js';

/**
 * @swagger
 * /api/admin/merchants:
 *   post:
 *     summary: Create a new merchant (admin only)
 *     description: |
 *       Admin-only route to create a new merchant record.  
 *       This only creates the merchant in the database and optionally stores an email address for later onboarding.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location, contact_number, image_url]
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
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Optional contact email for onboarding
 *           example:
 *             name: "GiveMeABraek"
 *             location: "SCIS Basement"
 *             contact_number: "91234567"
 *             image_url: "https://cdn.example.com/logo.jpg"
 *             payout_frequency: "weekly"
 *             email: "contact@givemeabraek.com"
 *     responses:
 *       201:
 *         description: Merchant created successfully
 *         content:
 *           application/json:
 *             example:
 *               merchant:
 *                 merchant_id: 5
 *                 name: "GiveMeABraek"
 *                 location: "SCIS Basement"
 *                 contact_number: "91234567"
 *                 image_url: "https://cdn.example.com/logo.jpg"
 *                 payout_frequency: "weekly"
 *                 email: "contact@givemeabraek.com"
 *       409:
 *         description: Merchant already exists
 *         content:
 *           application/json:
 *             example:
 *               error: "Merchant already exists with ID 5"
 *               code: "CONFLICT_MERCHANT"
 */
/**
 * POST /api/admin/merchants
 * Creates a new merchant with the provided data.
 * Expects fields: name, location, contact_number, image_url, payout_frequency (optional, defaults to weekly if absent), email (optional, default to null).
 */
export const addMerchant = async (req, res, next) => {
  try {
    const {
      name,
      location,
      contact_number,
      image_url,
      payout_frequency = 'weekly',
      email = null
    } = req.body;

    const merchant = await createMerchantOrThrow({
      name,
      location,
      contact_number,
      image_url,
      payout_frequency,
      email
    });

    res.status(201).json({ merchant });
  } catch (err) {
    next(err);
  }
};
