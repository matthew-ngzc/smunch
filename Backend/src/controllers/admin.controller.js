import { createMerchantOrThrow } from '../models/merchant.model.js';
import { getTestEmailHtml } from '../utils/emailHtmls.js';
import { sendTestEmail } from '../utils/mailer.js';

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


/**
 * @swagger
 * /api/admin/email-test:
 *   post:
 *     summary: Send a test email for internal validation
 *     description: |
 *       Sends a dummy email to the specified address using SMUNCH's email service.  
 *       This is intended for internal use only to verify that email delivery is working.
 *       
 *       The content of the email explicitly states it's for dev testing purposes.
 *       
 *       ⚠️ If this email is received by someone outside the dev team, they are instructed to notify the team via Telegram.
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 example: developer@smu.edu.sg
 *                 description: The recipient email address to send the test to
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Test email sent successfully
 *       400:
 *         description: Missing recipient email address
 *         content:
 *           application/json:
 *             example:
 *               message: Missing recipient email address
 *       500:
 *         description: Server error while attempting to send email
 */
/**
 * Sends a test email to the specified email address.
 *
 * POST /api/admin/email-test
 * Body: { to: string }
 */
export const testEmail = async (req, res, next) => {
  try{
    const {to} = req.body;
    if (!to) return res.status(400).json({ message: 'Missing recipient email address' });

    await sendTestEmail({to});
    return res.status(200).json({ message: 'Test email sent successfully' });
  }catch(err){
    next(err);
  }
}