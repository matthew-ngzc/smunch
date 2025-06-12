//for generating pdf
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

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
        <tr style="border-top:1px solid #ccc;">
          <td><strong>Total</strong></td><td style="text-align:right;"><strong>$${total}</strong></td>
        </tr>
      </table>

      <p style="margin-top: 30px;">We'll deliver your food right to your classroom.</p>

      <p style="font-size: 0.9em; color: #666;">Thank you for using SMUNCH 💙<br>Made for SMU students, by SMU students.</p>
    </div>
  `;
}

/**
 * Generates a PDF-formatted receipt for download or email attachment.
 *
 * @param {object} order - The full order object, including payment reference, `items: [...]`
 * @returns {Promise<Buffer>} - A Buffer containing the PDF file content
 */
export async function generateReceiptPDF(order) {
  const doc = new PDFDocument();
  const stream = new Readable({
    read() {}
  });

  doc.pipe(stream);
  // PDF Header
  doc.fontSize(20).text('SMUNCH Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${orderId}`);
  doc.text(`Payment reference: ${order.payment_reference}`);
  doc.text(`Delivery to: ${order.building} ${order.room_type} ${order.room_number}`);
  doc.text(`Delivery time: ${order.delivery_time}`);
  doc.moveDown();

  // PDF Body
  items.forEach(item => {
    const name = item.menu_items?.name || 'Item';
    const qty = item.quantity;
    const total = (item.price_cents * qty / 100).toFixed(2);
    doc.text(`${qty}x ${name} - $${total}`);
  });

  doc.moveDown();
  const total = (order.total_amount_cents / 100).toFixed(2);
  doc.text(`Total: $${total}`, { align: 'right' });

  doc.end();
  // Convert the PDF stream to a Buffer
  const chunks = [];
  return new Promise((resolve, reject) => {
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}
