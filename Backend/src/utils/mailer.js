//Using Gmail account
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { 
  getPasswordChangeHtml,
  getReceiptHtml,
  getReminderEmailHtmlFinalCall,
  getReminderEmailHtmlOneDayBefore,
  getTestEmailHtml,
  getVerificationEmailHtml } from './emailHtmls.js';

dotenv.config();

const SMUNCH_FROM_ADDRESS = '"SMUNCH" <smunch.dev@gmail.com>';

// 1. ENV validation — log and fail fast if missing
if (!process.env.SMUNCH_EMAIL || !process.env.SMUNCH_APP_PASS) {
  console.error('[ERROR] Missing Gmail credentials in environment variables!');
  console.error('[DEBUG] SMUNCH_EMAIL:', process.env.SMUNCH_EMAIL);
  console.error('[DEBUG] SMUNCH_APP_PASS:', process.env.SMUNCH_APP_PASS ? '[REDACTED]' : undefined);
  throw new Error('Missing SMUNCH_EMAIL or SMUNCH_APP_PASS');
}

export const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your SMTP provider
  auth: {
    user: process.env.SMUNCH_EMAIL,
    pass: process.env.SMUNCH_APP_PASS,
  },
});

// 3. Run verification test once when module is loaded
transporter.verify((error, success) => {
  if (error) {
    console.error('[MAILER VERIFY FAILED]', error);
  } else {
    console.log('[MAILER] Transporter ready to send emails.');
  }
});

/**
 * Sends a testing email, meant for devs
 *
 * @param {Object} options
 * @param {string} options.to - The recipient's email address
 * @returns {Promise} - Resolves when the email is sent successfully
 */
export const sendTestEmail = async ({ to }) => {
  const html = getTestEmailHtml();

  return transporter.sendMail({
    from: SMUNCH_FROM_ADDRESS,
    to,
    subject: '🔧 Test Email from SMUNCH',
    html
  });
}

// ============================================================================
// 🔐 AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sends a verification email to the user or merchant with a link to verify their account.
 *
 * @param {Object} options
 * @param {string} options.to - The recipient's email address
 * @param {string} options.token - The verification token
 * @param {'user'|'merchant'} options.type - Type of signup ('user' or 'merchant')
 * @returns {Promise} - Resolves when the email is sent successfully
 */
export const sendVerificationEmail = async ({ to, name, token, role} ) => {
  const path = role === 'merchant' ? 'merchant/verify-signup' : 'verify';
  const link = `${process.env.FRONTEND_URL}/api/auth/${path}?token=${token}`;
  const accountType = role === 'merchant' ? 'Merchant' : 'User';
  const html = getVerificationEmailHtml({ link, accountType, name});
  return transporter.sendMail({
    from: SMUNCH_FROM_ADDRESS,
    to,
    subject: 'Welcome to SMUNCH! Just one more step',
    html
  });
};

/**
 * Sends a notification email to the user if their password was changed.
 *
 * @param {string} to - Recipient's email
 * @param {string} name - Recipient's name
 * @param {Date} changeDate - Date/time when the password was changed
 * @returns {Promise<void>}
 */
export async function sendPasswordChangeNotification(to, name, changeDate = new Date()) {
  const formattedDate = changeDate.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });
  const html = getPasswordChangeHtml({ name, formattedDate });

  return transporter.sendMail({
    from: SMUNCH_FROM_ADDRESS,
    to,
    subject: 'Your SMUNCH Password Was Changed',
    html,
  });
}

/**
 * Sends a password reset email to the user with a reset link.
 *
 * @param {string} to - Recipient's email
 * @param {string} link - Password reset URL
 * @param {string} [name='Smunchie'] - Name of the user
 * @returns {Promise<void>}
 */
export async function sendResetPasswordEmail(to, link, name = 'Smunchie') {
  const html = getResetPasswordHtml({ link, name });

  return transporter.sendMail({
    from: SMUNCH_FROM_ADDRESS,
    to,
    subject: 'Reset your SMUNCH password',
    html
  });
}



// ============================================================================
// 🛒 ORDER-RELATED FUNCTIONS
// ============================================================================



/**
 * Sends a confirmation email with the receipt attached.
 *
 * @param {string} to - The recipient's email address
 * @param {string} htmlBody - The HTML content of the email
 * @returns {Promise<void>}
 */
export async function sendReceiptEmail(to, order) {
  const receiptHtml = getReceiptHtml(order);
  return transporter.sendMail({
    from: SMUNCH_FROM_ADDRESS,
    to,
    subject: 'Payment Received! Your SMUNCH Order is Confirmed',
    html: receiptHtml
  });
}

/**
 * Sends a 1-day-before reminder email to the user for an unpaid order.
 *
 * This is typically called by the nightly cron job that runs around 9:00 PM,
 * for orders scheduled to be delivered the next day.
 *
 * @param {object} user - User object containing at least `email` and `name`
 * @param {object} order - Order object including order_id, delivery_time, room, etc.
 * @returns {Promise<void>}
 */
export async function sendReminderEmailOneDayBefore(user, order) {
  const html = getReminderEmailHtmlOneDayBefore(order, user.name || 'Smunchie');

  return transporter.sendMail({
    from: SMUNCH_FROM_ADDRESS,
    to: user.email,
    subject: '⏳ Reminder: Complete Your SMUNCH Order',
    html
  });
}

/**
 * Sends a final-call reminder email 40 minutes before delivery time,
 * alerting the user that their order is about to be excluded.
 *
 * @param {string} email - recipient's email address
 * @param {string} name - recipient's name
 * @param {object} order - Order object including order_id, delivery_time, room, etc.
 * @returns {Promise<void>}
 */
export async function sendReminderEmailFinalCall(email, name = 'Smunchie', order) {
  const html = getReminderEmailHtmlFinalCall(order, name);

  return transporter.sendMail({
    from: SMUNCH_FROM_ADDRESS,
    to: email,
    subject: '🚨 Final Call: Complete Payment for Your SMUNCH Order',
    html
  });
}


