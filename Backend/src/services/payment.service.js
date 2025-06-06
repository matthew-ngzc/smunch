import QRCode from 'qrcode';
import {paynowGenerator} from 'paynow-generator';
import dotenv from "dotenv";

dotenv.config();

const PAYNOW_PROXYTYPE = "mobile";
const REFERENCE_PREFIX = "SMUNCH-";
const MERCHANT_NAME = "SMUNCH";

/**
 * Generates a PayNow QR code image as a Data URI using fixed proxy settings.
 * 
 * This function generates a dynamic PayNow QR code using:
 * - a fixed proxy type ('mobile'),
 * - a fixed PayNow-registered phone number from .env'),
 * - a fixed merchant name (e.g. 'SMUNCH'),
 * - a fixed non-editable amount field.
 * 
 * The only dynamic inputs are the transaction amount and order/customer identifiers,
 * which are used to compute a unique payment reference in the format: "SMUNCH-{orderId}-{customerId}".
 *
 * @param {string|number} amount - Transaction amount in SGD dollars (e.g. '7.90' or 7.90).
 * @param {string|number} orderId - The unique ID of the order.
 * @param {string|number} customerId - The unique ID of the customer placing the order.
 * @returns {Promise<string>} A Base64-encoded PNG QR code as a Data URI for embedding.
 */

export async function generatePayNowQRCode({amount, orderId, customerId,}) {
  try {
    /*
     * PayNow QR Code Parameters:
     * - proxyType: 'mobile' or 'UEN'
     * - proxyValue: 8-digit SG number or company UEN
     * - edit: 'yes' or 'no' (allow user to edit amount)
     * - price: amount in SGD
     * - merchantName (optional): display name (defaults to 'NA')
     * - additionalComments (optional): reference or comment (e.g. order ID)
    
     * Output : 
     * - EMVCo-compliant string payload to be encoded as a QR code
     */
    const reference = await generatePaymentReference(orderId, customerId);
    const payload = paynowGenerator(
      PAYNOW_PROXYTYPE, //"mobile"
      process.env.PAYNOW_NUMBER, // PayNow-registered phone number from .env
      "no", // no editing
      amount, //payment amount in SGD
      MERCHANT_NAME, //merchant name
      reference // reference number
    );
    // Generate the QR code as a Data URI
    const qrCodeDataURL = await QRCode.toDataURL(payload);
    // Return a Base64-encoded PNG image that can be embedded in HTML
    return qrCodeDataURL;
  } catch (error) {
    console.error('[QR GENERATION ERROR]', error);
    throw new Error('Failed to generate PayNow QR code');
  }
}

/**
 * Generates a unique payment reference for an order.
 *
 * @param {string} orderId - The ID of the order
 * @param {string} customerId - The ID of the customer
 * @returns {Promise<string>} - A unique payment reference in the format "SMUNCH-{orderId}-{customerId}"
 */
export async function generatePaymentReference(orderId, customerId){
  // Ensure orderId and customerId are strings
  const orderIdStr = String(orderId);
  const customerIdStr = String(customerId);

  // Generate a unique reference using the order ID and customer ID
  return `${REFERENCE_PREFIX}${orderIdStr}-${customerIdStr}`;
}
