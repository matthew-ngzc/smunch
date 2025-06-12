import QRCode from 'qrcode';
import {paynowGenerator} from 'paynow-generator';
import { CRC } from 'crc-full';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
 * @returns {Promise<{ qrCodeDataURL: string, paymentReference: string, paynowNumber: string }>}
 *   A Base64 QR code image, the payment reference used, and the PayNow number used
 */

export async function generatePayNowQRCode({amount, orderId, customerId,}) {
  try {
    /*
     * PayNow QR Code Parameters:
     * - proxyType: 'mobile' or 'UEN'
     * - proxyValue: 8-digit SG number or company UEN
     * - edit: 'yes' or 'no' (allow user to edit amount)
     * - amount: amount in SGD
     * - merchantName (optional): display name (defaults to 'NA')
     * - additionalComments (optional): reference or comment (e.g. order ID)
    
     * Output : 
     * - EMVCo-compliant string payload to be encoded as a QR code
     */
    const reference = await generatePaymentReference(orderId, customerId);
    // const payload = paynowGenerator(
    //   PAYNOW_PROXYTYPE, //"mobile"
    //   process.env.PAYNOW_NUMBER, // PayNow-registered phone number from .env
    //   "no", // no editing
    //   amount, //payment amount in SGD
    //   MERCHANT_NAME, //merchant name
    //   reference // reference number
    // );
    const paynowNumber = process.env.PAYNOW_NUMBER;
    if (!paynowNumber) {
      throw new Error('PayNow number is not configured in environment variables');
    }
    const payload = generatePayNowPayload(
      PAYNOW_PROXYTYPE, //"mobile"
      paynowNumber, // PayNow-registered phone number from .env
      false,
      amount, //payment amount in SGD
      MERCHANT_NAME, //merchant name
      reference // reference number
    );
    // Generate the QR code as a Data URI
    const qrCodeDataURLBnW = await QRCode.toDataURL(payload);
    // const qrCodeDataURL = await generateStyledPayNowQRCode(payload, {
    //   logoPath: '../../logos/paynow-logo.png',
    //   expiryText: 'Valid till Jun 14, 2025'
    // });

    // Return a Base64-encoded PNG image that can be embedded in HTML, payment reference and number for non DBS payment
    return {
      qrCodeDataURL: qrCodeDataURLBnW,
      paymentReference: reference,
      paynowNumber: paynowNumber
    };
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

/*

*/
export function generatePayNowPayload(
  proxyType = 'mobile',     // 'mobile' or 'UEN'
  proxyValue,               // e.g. '91234567' or '202312345A'
  editable = false,         // true allows user to change amount
  amount,                   // e.g. '7.90'
  merchantName = 'SMUNCH',  // up to 25 chars
  reference = ''            // e.g. 'SMUNCH-42-12'
) {
  console.log("[DEBUG] : " + reference)
  const pad = (val, len = 2) => val.toString().padStart(len, '0');
  const build = (id, value) => pad(id) + pad(value.length) + value;

  const proxyTypeCode = proxyType === 'UEN' ? '2' : '0';
  const fullProxy = proxyType === 'mobile' ? `+65${proxyValue}` : proxyValue;

  
  const refField = build('01', reference);     // Subfield ID "05"
  const field62 = build('62', refField);       // Wrap it properly as EMV template

  const payload = [
    build('00', '01'), // Payload Format Indicator
    build('01', '12'), // Point of Initiation Method (dynamic)
    build('26',
      build('00', 'SG.PAYNOW') +
      build('01', proxyTypeCode) +
      build('02', fullProxy)
    ),
    build('30', editable ? '1' : '0'), // Amount editable flag
    build('04', '99991231'), // optional, end of time
    build('52', '0000'), // Merchant category
    build('53', '702'),  // Currency (SGD)
    build('54', Number(amount).toFixed(2)), // Amount
    build('58', 'SG'),   // Country
    build('59', merchantName.substring(0, 25)), // Merchant name
    build('60', 'Singapore'), // City
    field62 // Reference field
  ];
  
  const joined = payload.join('');
  const crc = CRC.default('CRC16_CCITT_FALSE');
  const checksum = crc.compute(Buffer.from(joined + '6304', 'ascii'))
    .toString(16).toUpperCase().padStart(4, '0');

  return joined + '6304' + checksum;
}
import fs from 'fs';
/**
 * Generates a styled PayNow QR with:
 * - purple theme
 * - embedded PAYNOW logo in the center
 * - optional expiry note below
 * 
 * @param {string} payload - The raw EMV payload string
 * @param {object} options - Optional parameters: { logoPath, expiryText }
 * @returns {Promise<string>} - Base64-encoded PNG (e.g. data:image/png;base64,...)
 */
export async function generateStyledPayNowQRCode(payload, options = {}) {
  const {
    logoPath = '../../logos/paynow-logo.png',
    expiryText = null
  } = options;

  const jimpModule = await import('jimp');
  const Jimp = jimpModule.Jimp; // ✅ fallback if default missing
  const MIME_PNG = 'image/png';


  console.log('[DEBUG Jimp]', Object.keys(jimpModule));
  

  const absoluteLogoPath = path.resolve(__dirname, logoPath);
  console.log(fs.existsSync(absoluteLogoPath)); // should print true


  // 1. Generate QR code buffer
  const qrBuffer = await QRCode.toBuffer(payload, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 500,
    margin: 2,
    color: {
      dark: '#800080',  // PayNow purple
      light: '#FFFFFF'
    }
  });

  // 2. Read QR and logo
  const qrImage = await Jimp.read(qrBuffer);
  //const logo = await Jimp.read(absoluteLogoPath);

  // 3. Resize and composite logo
  // const logoWidth = Math.floor(qrImage.bitmap.width / 4);
  // const scaleFactor = logoWidth / logo.bitmap.width;
  // const logoHeight = Math.floor(logo.bitmap.height * scaleFactor);

  // logo.resize({ w: logoWidth, h: logoHeight }); // ✅ correct for your version



  // const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
  // const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;
  // qrImage.composite(logo, x, y);

  // 4. Add expiry text if present
  // if (expiryText) {
  //   const font = await Jimp.Jimp.loadFont(Jimp.Jimp.FONT_SANS_16_PURPLE);

  //   qrImage.print(
  //     font,
  //     0,
  //     qrImage.bitmap.height - 30,
  //     {
  //       text: expiryText,
  //       alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  //       alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
  //     },
  //     qrImage.bitmap.width,
  //     30
  //   );
  // }

  // 5. Return Base64-encoded PNG string
  const base64 = await getBase64Safely(qrImage, 'image/png');


  return base64; // e.g. "data:image/png;base64,iVBORw0KGgo..."
}

function getBase64Safely(image, mime, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout: getBuffer never returned')), timeoutMs);
    image.getBuffer(mime, (err, buffer) => {
      clearTimeout(timer);
      if (err) return reject(err);
      resolve(`data:${mime};base64,${buffer.toString('base64')}`);
    });
  });
}


