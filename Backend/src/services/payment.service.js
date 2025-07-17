import QRCode from 'qrcode';
import { CRC } from 'crc-full';
import dotenv from "dotenv";
import axios from 'axios';
import { getOrdersPendingPaymentCheck } from '../models/order.model.js';
import { formatCentsToDollars } from '../utils/payment.utils.js';
//import {paynowGenerator} from 'paynow-generator';
//import path from 'path';
//import { fileURLToPath } from 'url';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


dotenv.config();

const PAYNOW_PROXYTYPE = "mobile";
const REFERENCE_PREFIX = "SMUNCH";
const MERCHANT_NAME = "SMUNCH";
const SGQR_API_URL = 'https://www.sgqrcode.com/paynow';

/**
 * Generates a unique payment reference for an order.
 *
 * @param {string} orderId - The ID of the order
 * @returns {Promise<string>} - A unique payment reference in the format "SMUNCH{orderId}"
 */
export async function generatePaymentReference(orderId){
  // Ensure orderId and customerId are strings
  const orderIdStr = String(orderId);

  // Generate a unique reference using the order ID
  return `${REFERENCE_PREFIX}${orderIdStr}`;
}

export async function generatePayNowQRCodeUsingSGQR({amount, orderId}){
  const paynowNumber = process.env.PAYNOW_NUMBER;
  const reference = await generatePaymentReference(orderId);
  try {
    // Format expiry: 2025/07/07 23:00
    const now = new Date();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    // Convert to Singapore time (GMT+8)
    const sgTime = new Date(expiry.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));

    // Format as YYYY/MM/DD HH:MM
    const yyyy = sgTime.getFullYear();
    const mm = String(sgTime.getMonth() + 1).padStart(2, '0');
    const dd = String(sgTime.getDate()).padStart(2, '0');
    const hh = String(sgTime.getHours()).padStart(2, '0');
    const min = String(sgTime.getMinutes()).padStart(2, '0');

    const expiryStr = `${yyyy}/${mm}/${dd} ${hh}:${min}`;


    // Make external QR request
    const response = await axios.get(SGQR_API_URL, {
      responseType: 'arraybuffer',
      params: {
        mobile: paynowNumber,
        uen: '',
        editable: 0, //0 for not editable, 1 for editable
        amount,
        expiry: expiryStr,
        ref_id: reference,
        company: ''
      },
      headers: {
        Accept: 'image/png,image/*,*/*;q=0.8',
      }
    });

    // convert image to base64 to send to frontend
    const base64Image = Buffer.from(response.data).toString('base64');
    const qrCodeDataURL = `data:image/png;base64,${base64Image}`;

    return {
      qrCodeDataURL,
      paymentReference: reference,
      paynowNumber
    };

  } catch (error) {
    console.error('[QR Fallback Error, using default QR code generator]', error.message);
    return generatePayNowQRCode({amount, orderId});
  }
}


//--------------------------------------------------------------------------------------------
// * use the generatePayNowQRCode function and generatePayNowPayload to create the paynow QR code that only works with DBS. Fall back to this if the API from sgqrcode stops working

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

export async function generatePayNowQRCode({amount, orderId}) {
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
    const reference = await generatePaymentReference(orderId);
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

/**
 * Returns all orders pending payment ('awaiting_payment', 'awaiting_verification') with formatted structure.
 * 
 * Used by: admin dashboard, payment verification
 * 
 * Example return format:
 * [
 *   {
 *     order_id: 187,
 *     reference_number: "SMUNCH187",
 *     amount: "4.20",
 *     payment_status: "awaiting_payment",
 *     payment_screenshot_url: null,
 *     paid: false
 *   },
 *   {
 *     order_id: 188,
 *     reference_number: "SMUNCH188",
 *     amount: "7.50",
 *     payment_status: "awaiting_verification",
 *     payment_screenshot_url: "https://cdn.example.com/screenshot.png",
 *     paid: false
 *   }
 * ]
 */
export async function buildPendingTransactions() {
  const rawOrders = await getOrdersPendingPaymentCheck();
  return rawOrders.map(order => ({
    order_id: order.order_id,
    reference_number: order.payment_reference,
    amount: formatCentsToDollars(order.total_amount_cents),
    payment_status: order.payment_status,
    payment_screenshot_url: order.payment_screenshot_url || null,
    paid: false
  }));
}


//-----------------------------------------------------------------------------------------------------------

//import fs from 'fs';
/**
 ** CODE IS NOT IN USE. THIS WAS MY ATTEMPT TO BUILD MY OWN STYLED QR CODE
 * Generates a styled PayNow QR with:
 * - purple theme
 * - embedded PAYNOW logo in the center
 * - optional expiry note below
 * 
 * @param {string} payload - The raw EMV payload string
 * @param {object} options - Optional parameters: { logoPath, expiryText }
 * @returns {Promise<string>} - Base64-encoded PNG (e.g. data:image/png;base64,...)
 */
// export async function generateStyledPayNowQRCode(payload, options = {}) {
//   const {
//     logoPath = '../../logos/paynow-logo.png',
//     expiryText = null
//   } = options;

//   const jimpModule = await import('jimp');
//   const Jimp = jimpModule.Jimp; // ✅ fallback if default missing
//   const MIME_PNG = 'image/png';


//   console.log('[DEBUG Jimp]', Object.keys(jimpModule));
  

//   const absoluteLogoPath = path.resolve(__dirname, logoPath);
//   console.log(fs.existsSync(absoluteLogoPath)); // should print true


//   // 1. Generate QR code buffer
//   const qrBuffer = await QRCode.toBuffer(payload, {
//     errorCorrectionLevel: 'H',
//     type: 'png',
//     width: 500,
//     margin: 2,
//     color: {
//       dark: '#800080',  // PayNow purple
//       light: '#FFFFFF'
//     }
//   });

//   // 2. Read QR and logo
//   const qrImage = await Jimp.read(qrBuffer);
//   //const logo = await Jimp.read(absoluteLogoPath);

//   // 3. Resize and composite logo
//   // const logoWidth = Math.floor(qrImage.bitmap.width / 4);
//   // const scaleFactor = logoWidth / logo.bitmap.width;
//   // const logoHeight = Math.floor(logo.bitmap.height * scaleFactor);

//   // logo.resize({ w: logoWidth, h: logoHeight }); // ✅ correct for your version



//   // const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
//   // const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;
//   // qrImage.composite(logo, x, y);

//   // 4. Add expiry text if present
//   // if (expiryText) {
//   //   const font = await Jimp.Jimp.loadFont(Jimp.Jimp.FONT_SANS_16_PURPLE);

//   //   qrImage.print(
//   //     font,
//   //     0,
//   //     qrImage.bitmap.height - 30,
//   //     {
//   //       text: expiryText,
//   //       alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
//   //       alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
//   //     },
//   //     qrImage.bitmap.width,
//   //     30
//   //   );
//   // }

//   // 5. Return Base64-encoded PNG string
//   const base64 = await getBase64Safely(qrImage, 'image/png');


//   return base64; // e.g. "data:image/png;base64,iVBORw0KGgo..."
// }

//not in use
// function getBase64Safely(image, mime, timeoutMs = 3000) {
//   return new Promise((resolve, reject) => {
//     const timer = setTimeout(() => reject(new Error('Timeout: getBuffer never returned')), timeoutMs);
//     image.getBuffer(mime, (err, buffer) => {
//       clearTimeout(timer);
//       if (err) return reject(err);
//       resolve(`data:${mime};base64,${buffer.toString('base64')}`);
//     });
//   });
// }


