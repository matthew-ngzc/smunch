
// TODO: Update this url with banner. For now temporarily put the smunch logo
const BANNER_URL = 'https://ik.imagekit.io/6iuitt2kb/banner.PNG?updatedAt=1752590670468';

/**
 * Wraps the inner email content with a standard SMUNCH layout.
 * 
 * This ensures all outgoing emails include:
 * - A consistent header banner
 * - Unified font, width, and padding
 * - Mobile-friendly formatting
 * - Global sign-off and footer branding
 * 
 * 📌 Call this at the end of ALL HTML email generator functions (e.g. getVerificationEmailHtml, getReceiptEmailHtml)
 * to apply the global layout wrapper. Do not include outer divs or banner images inside individual email templates.
 *
 * @param {string} innerHtml - The email-specific content block (e.g. verification message, receipt, etc.)
 * @returns {string} - Fully formatted HTML email with layout applied
 */
export function wrapWithEmailLayout(innerHtml) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <img src="${BANNER_URL}" alt="SMUNCH Banner" style="width: 100%; max-width: 600px; display: block; margin-bottom: 20px;" />
      
      <div style="padding: 20px;">
        <div style="margin: 0 0 20px 0; line-height: 1.5;">
          ${innerHtml}
        </div>

        <p style="margin: 0 0 12px 0;">Regards,<br>The SMUNCH Team 💙</p>
        <p style="font-size: 0.9em; color: #666; margin: 0;">Made for SMU students, by SMU students.</p>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML body for a SMUNCH account verification email.
 *
 * @param {Object} params - Email generation parameters
 * @param {string} params.link - The verification URL to be embedded in the email
 * @param {string} params.displayType - Role of the recipient ("User" or "Merchant")
 * @param {string} [params.name='Smunchie'] - Display name to greet the user; defaults to "Smunchie" if not provided
 * @returns {string} - HTML string to be sent as the email body
 *
 * 📧 Example of how the email will look:
 *
 * -----------------------------------------------------
 * Subject: Welcome to SMUNCH! Just one more step
 *
 * Hey Rachel,
 *
 * Thanks for signing up! Just one last step — click the link below to verify your user account:
 * [Verify My Account] → https://smunch.sg/api/auth/verify?token=abc123
 *
 * This link expires in 1 hour for your security.
 * If you didn’t request this, you can safely ignore this email.
 *
 * 💙 Made for SMU students, by SMU students
 * -----------------------------------------------------
 */
export function getVerificationEmailHtml({ link, accountType, name = 'Smunchie' }) {
  const body = `
    <h2>Welcome to SMUNCH 🎉</h2>
    <p>Hey ${name},</p>
    <p>Thanks for signing up! Just one last step — <a href="${link}">click here</a> to verify your ${accountType.toLowerCase()} account.</p>
    <p>This link will expire in 1 hour for your security. If you didn’t request this, feel free to ignore this email.</p>
  `;

  return wrapWithEmailLayout(body);
}


/**
 * Generates an HTML-formatted receipt for embedding in a confirmation email.
 *
 * @param {object} order - The full order object, including payment reference,`items: [...]`
 * @returns {Promise<string>} - A string of HTML representing the receipt email
 *
 * 📧 Example of how the email will look:
 *
 * -----------------------------------------------------
 * Subject: Your SMUNCH Order Has Been Confirmed! 🥪
 *
 * Hi there! We've received your payment and confirmed your order.
 *
 * Order ID: 42
 * Payment Reference: SMUNCH-123-45
 * Delivery To: SCIS SR 2-2
 * Scheduled For: Jan 3, 2025, 12:00 PM
 *
 * Receipt:
 *   1x Coffee .................. $2.50
 *   2x Toast ................... $3.00
 *   Delivery Fee ............... $1.00
 *   -------------------------------
 *   Total ...................... $5.50
 *
 * We'll deliver your food right to your classroom. 🍱
 * Thank you for using SMUNCH 💙
 * Made for SMU students, by SMU students.
 * -----------------------------------------------------
 */
export function getReceiptHtml(order) {
  const rows = order.items.map(item => {
    const name = item.menu_items?.name || 'Item';
    const qty = item.quantity;
    const price = (item.price_cents * qty / 100).toFixed(2);
    return `<tr><td>${qty}x ${name}</td><td style="text-align:right;">$${price}</td></tr>`;
  }).join('');

  const total = (order.total_amount_cents / 100).toFixed(2);
  const delivery_fee = (order.delivery_fee_cents / 100).toFixed(2);
  const delivery_time = new Date(order.delivery_time).toLocaleString('en-SG');

  const body = `
    <h2 style="color: #333;">🎉 Your payment has been received!</h2>
    <p>Hi there! We're excited to let you know that we've received your payment and your order has been confirmed.</p>

    <p><strong>Order ID:</strong> ${order.order_id}<br>
       <strong>Payment Reference:</strong> ${order.payment_reference}<br>
       <strong>Delivery To:</strong> ${order.building} ${order.room_type} ${order.room_number}<br>
       <strong>Scheduled For:</strong> ${delivery_time}</p>

    <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Your Receipt</h3>
    <table style="width: 100%; border-collapse: collapse;">
      ${rows}
      <tr>
        <td>Delivery Fee</td><td style="text-align:right;">$${delivery_fee}</td>
      </tr>
      <tr style="border-top:1px solid #ccc;">
        <td><strong>Total</strong></td><td style="text-align:right;"><strong>$${total}</strong></td>
      </tr>
    </table>

    <p style="margin-top: 30px;">We'll deliver your food right to your classroom. 🍱</p>
  `;

  return wrapWithEmailLayout(body);
}

/**
 * Generates an HTML-formatted email to notify users of a password change.
 *
 * @param {Object} params
 * @param {string} params.formattedDate - Formatted timestamp of the password change (in Singapore time)
 * @param {string} [params.name='Smunchie'] - Name of the recipient (defaults to "Smunchie" if not provided)
 * @returns {string} - HTML string to be sent as the email body
 *
 * 📧 Example of how the email will look:
 *
 * -----------------------------------------------------
 * Subject: Your SMUNCH Password Was Changed 🔐
 *
 * Hey Rachel,
 *
 * This is a quick heads-up that your SMUNCH account password was changed on:
 * July 15, 2025, 5:42:10 PM
 *
 * If this was you, no action is needed.
 * If this wasn’t you, please reach out to us immediately at smunch.dev@gmail.com.
 *
 * Regards,
 * The SMUNCH Team 💙
 * Made for SMU students, by SMU students.
 * -----------------------------------------------------
 */
export function getPasswordChangeHtml({ name, formattedDate }) {
  const body = `
    <h2>Password Change Confirmation 🔐</h2>
    <p>Hey ${name},</p>
    <p>This is a quick heads-up that your SMUNCH account password was changed on <strong>${formattedDate}</strong>.</p>
    <p>If this was you, no action is needed.</p>
    <p>If this wasn't you, please reach out to us immediately at <a href="mailto:${process.env.SMUNCH_EMAIL}">${process.env.SMUNCH_EMAIL}</a>.</p>
  `;

  return wrapWithEmailLayout(body);
}

/**
 * Generates an HTML email for password reset.
 *
 * @param {Object} params
 * @param {string} params.link - Password reset link
 * @param {string} [params.name='Smunchie'] - Name to greet the user
 * @returns {string} - Fully wrapped HTML email
 */
export function getResetPasswordHtml({ link, name = 'Smunchie' }) {
  const body = `
    <h2>Reset Your Password 🔑</h2>
    <p>Hey ${name},</p>
    <p>We received a request to reset your SMUNCH password.</p>
    <p><a href="${link}">Click here to reset your password</a>. This link will expire in 15 minutes.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
  `;

  return wrapWithEmailLayout(body);
}