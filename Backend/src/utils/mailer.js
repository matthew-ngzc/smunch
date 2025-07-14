
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendVerificationEmail = async (to, token) => {
//   const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;

//   await resend.emails.send({
//     from: 'SMUNCH <onboarding@resend.dev>',
//     to,
//     subject: 'Verify your SMUNCH account',
//     html: `<p>Welcome to SMUNCH! Click <a href="${link}">here</a> to verify your account. This link expires in 1 hour.</p>`
//   });
// };


//Using Gmail account
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

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
 * Sends a verification email to the user or merchant with a link to verify their account.
 *
 * @param {Object} options
 * @param {string} options.to - The recipient's email address
 * @param {string} options.token - The verification token
 * @param {'user'|'merchant'} options.type - Type of signup ('user' or 'merchant')
 * @returns {Promise} - Resolves when the email is sent successfully
 */
export const sendVerificationEmail = async ({ to, token, role} ) => {
  console.log('[DEBUG]', process.env.SMUNCH_EMAIL, process.env.SMUNCH_APP_PASS);

  const path = role === 'merchant' ? 'merchant/verify-signup' : 'verify';
  //const link = `${process.env.BACKEND_URL}/api/auth/verify?token=${token}`;
  const link = `${process.env.FRONTEND_URL}/api/auth/${path}?token=${token}`;
  const displayType = role === 'merchant' ? 'Merchant' : 'User';
  return transporter.sendMail({
    from: '"SMUNCH" <smunch.dev@gmail.com>',
    to,
    subject: 'Verify your SMUNCH Account',
    html: `<p>Click <a href="${link}">here</a> to complete your ${displayType.toLowerCase()} signup. Link expires in 1 hour.</p>`,
  });
};

/**
 * Sends a confirmation email with the receipt attached.
 *
 * @param {string} to - The recipient's email address
 * @param {string} htmlBody - The HTML content of the email
 * @returns {Promise<void>}
 */
export async function sendReceiptEmail(to, receiptHtml) {
  return transporter.sendMail({
    from: '"SMUNCH" <smunch.dev@gmail.com>',
    to,
    subject: 'Payment Received! Your SMUNCH Order is Confirmed',
    html: receiptHtml
  });
}
