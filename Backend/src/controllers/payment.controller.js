import { getFullOrderByIdOrThrow } from '../models/order.model.js';
import { getUserEmailByIdOrThrow } from '../models/user.model.js';
import { generateReceiptHtml} from '../services/receipt.service.js';
import { sendReceiptEmail } from '../utils/mailer.js';
import {
    generatePaymentReference,
    generatePayNowQRCode
} from '../services/payment.service.js';

/**
 * POST /api/payment/confirm/:orderId
 * Confirms payment and emails the receipt to the user.
 */
export const confirmPaymentAndSendReceipt = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Fetch order with items
    const order = await getFullOrderByIdOrThrow(orderId);
    console.log('[DEBUG] order.items:', JSON.stringify(order.items, null, 2));


    // Attach payment reference dynamically
    order.payment_reference = await generatePaymentReference(order.order_id, order.customer_id);

    // Verify payment
    const total = (order.total_amount_cents / 100).toFixed(2);
    //const isVerified = await verify_payment(total, order.payment_reference);
    const isVerified = true;
    if (!isVerified) {
      return res.status(202).json({
        message: 'Payment not yet verified. Try again later.',
        verified: false
      });
    }

    // Generate receipt content
    const html = await generateReceiptHtml(order);

    // Fetch user email
    const email = await getUserEmailByIdOrThrow(order.customer_id);
    if (!email) return res.status(404).json({ message: 'User email not found' });
    // Send the email
    await sendReceiptEmail(email, html);

    res.status(200).json({ message: 'Receipt email sent successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/:orderId/payment
 *
 * Regenerates PayNow QR code, reference number, and PayNow phone.
 * Use when user revisits the payment screen.
 */
export async function getPaymentInstructions(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await getFullOrderByIdOrThrow(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const amount = (order.total_amount_cents / 100).toFixed(2);
    const { qrCodeDataURL, paymentReference, paynowNumber } = await generatePayNowQRCode({
      amount: amount,
      orderId: order.order_id,
      customerId: order.customer_id,
    });

    res.status(200).json({
      qrCode: qrCodeDataURL,
      payment_reference: paymentReference,
      paynow_number: paynowNumber
    });
  } catch (err) {
    next(err);
  }
}
