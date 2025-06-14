//for generating pdf
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';

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
export async function generateReceiptHtml(order) {
  //extract the items from the order, convert to HTML table rows
  const rows = order.items.map(item => {
    const name = item.menu_items?.name || 'Item';
    const qty = item.quantity;
    const price = (item.price_cents * qty / 100).toFixed(2);
    return `<tr><td>${qty}x ${name}</td><td style="text-align:right;">$${price}</td></tr>`;
  }).join('');

  const total = (order.total_amount_cents / 100).toFixed(2);
  const delivery_fee = (order.delivery_fee_cents / 100).toFixed(2);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color: #333;">🎉 Your payment has been received!</h2>
      <p>Hi there! We're excited to let you know that we've received your payment and your order has been confirmed.</p>

      <p><strong>Order ID:</strong> ${order.order_id}<br>
         <strong>Payment Reference:</strong> ${order.payment_reference}<br>
         <strong>Delivery To:</strong> ${order.building} ${order.room_type} ${order.room_number}<br>
         <strong>Scheduled For:</strong> ${new Date(order.delivery_time).toLocaleString('en-SG')}</p>

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

      <p style="margin-top: 30px;">We'll deliver your food right to your classroom.</p>

      <p style="font-size: 0.9em; color: #666;">Thank you for using SMUNCH 💙<br>Made for SMU students, by SMU students.</p>
    </div>
  `;
}