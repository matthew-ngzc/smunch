import {
  createOrderOrThrow,
  updateOrderStatusOrThrow,
  getOrdersByCustomerIdOrThrow
} from '../models/order.model.js';
import { generatePayNowQRCode } from '../services/payment.service.js';

/**
 * POST /api/orders
 *
 * Creates a new order and returns:
 * - the created order object
 * - a dynamically generated PayNow QR code as a Base64 Data URI
 * - a unique payment reference (e.g., SMUNCH-{orderId}-{customerId})
 * - the PayNow mobile number used for payment
 *
 * 📥 Expected `req.body`:
 * {
 *   customer_id: number,
 *   merchant_id: number,
 *   delivery_fee_cents: number,
 *   building: string,
 *   room_type: string,
 *   room_number: string,
 *   delivery_time: string (ISO timestamp),
 *   order_items: [
 *     { menu_item_id: number, quantity: number, price_cents: number, customisations?: object }
 *   ]
 * }
 *
 * 📤 Response `res.status(201)`:
 * {
 *   order: { ... },              // full order row (excluding items)
 *   qrCode: string,              // Base64-encoded PayNow QR code
 *   payment_reference: string,   // e.g., SMUNCH-42-1
 *   paynow_number: string        // e.g., '91234567'
 * }
 */
export const createOrder = async (req, res, next) => {
  try {
    //create the otder in the database
    const newOrder = await createOrderOrThrow(req.body);
    //if order creation failed, return error
    if (!newOrder) {
      return res.status(400).json({ message: 'Failed to create order' });
    }

    //extract data we need to create the PayNow QR code
    const { order_id, customer_id, total_amount_cents } = newOrder;
    const amountDollars = (Number(total_amount_cents) / 100).toFixed(2);

    //generate the PayNow QR code
    const {qrCodeDataURL, paymentReference, paynowNumber} = await generatePayNowQRCode({
      amount: amountDollars,
      orderId: order_id,
      customerId: customer_id
    });
    //if QR code generation failed, return error
    if (!qrCodeDataURL) {
      return res.status(500).json({ message: 'Failed to generate QR code' });
    }

    //output order and qr code
    res.status(201).json({
      order: newOrder,
      qrCode: qrCodeDataURL,
      payment_reference: paymentReference,
      paynow_number: paynowNumber
    });
  } catch (err) {
    // Handle foreign key violations for customer_id, merchant_id, or menu_item_id
    const constraint = err.constraint || err.details || '';
    if (err.code === '23503') {
      if (constraint.includes('orders_customer_id_fkey')) {
        return res.status(400).json({ message: 'Invalid customer_id: user does not exist' });
      }
      if (constraint.includes('orders_merchant_id_fkey')) {
        return res.status(400).json({ message: 'Invalid merchant_id: merchant does not exist' });
      }
      if (constraint.includes('order_items_menu_item_id_fkey')) {
        return res.status(400).json({ message: 'Invalid menu_item_id: menu item does not exist' });
      }
    }
    next(err);
  }
};

/**
 * PUT /api/orders/:orderId/status
 *
 * Updates the status of a specific order.
 * Only accepts predefined status strings (e.g., 'pending', 'confirmed', 'cancelled', etc.)
 *
 * 📥 Expected `req.body`:
 * {
 *   status: string
 * }
 *
 * 📤 Response:
 * {
 *   order: { ... }  // updated order object
 * }
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await updateOrderStatusOrThrow(orderId, status);
    res.json({ order: updatedOrder });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/user/:userId?type=active|history
 * Retrieves orders for a specific user.
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    let statuses;
    if (type === 'active') {
      statuses = ['pending', 'in_progress'];
    } else if (type === 'history') {
      statuses = ['completed', 'cancelled'];
    }
    const orders = await getOrdersByCustomerIdOrThrow(userId, statuses);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};
