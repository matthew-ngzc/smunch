import { createMerchantOrThrow } from '../models/merchant.model.js';
import { getOrdersPendingPaymentCheck } from '../models/order.model.js';
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

/**
 * @swagger
 * /api/admin/payments/pending:
 *   get:
 *     summary: Get all pending payments (admin only)
 *     description: |
 *       Retrieves a list of all orders where payment status is either `awaiting_payment` or `awaiting_verification`.
 *       
 *       🔒 **Access**:  
 *       ✅ Admins
 *       
 *       Each transaction includes the following fields:
 *       - `order_id`: Unique ID of the order
 *       - `reference_number`: Payment reference (e.g., SMUNCH-42-1)
 *       - `amount`: Total order amount in dollars (as a string)
 *       - `payment_status`: The current status of payment (`awaiting_payment` or `awaiting_verification`)
 *       - `payment_screenshot_url`: Screenshot URL uploaded by the customer (can be null)
 *       - `paid`: Always `false` (to denote unpaid status)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions that require manual verification
 *         content:
 *           application/json:
 *             example:
 *               transactions:
 *                 - order_id: 42
 *                   reference_number: "SMUNCH42"
 *                   amount: "5.20"
 *                   payment_status: "awaiting_payment"
 *                   payment_screenshot_url: "https://cdn.example.com/screenshots/order-42.png"
 *                   paid: false
 *                 - order_id: 43
 *                   reference_number: "SMUNCH43"
 *                   amount: "4.80"
 *                   payment_status: "awaiting_verification"
 *                   payment_screenshot_url: null
 *                   paid: false
 *       500:
 *         description: Server error while retrieving pending payments
 */
export const getPendingPayments = async (req, res, next) => {
  try {
    const rawOrders = await getOrdersPendingPaymentCheck();

    const transactions = rawOrders.map(order => ({
      order_id: order.order_id,
      reference_number: order.payment_reference,
      amount: (order.total_amount_cents / 100).toFixed(2),
      payment_status: order.payment_status,
      payment_screenshot_url: order.payment_screenshot_url || null,
      paid: false
    }));

    return res.status(200).json({ transactions });
  } catch (err) {
    next(err);
  }
};