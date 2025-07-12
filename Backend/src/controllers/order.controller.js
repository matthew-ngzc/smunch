import { ORDER_STATUSES, PAYMENT_STATUSES } from '../constants/enums.constants.js';
import {
  createOrderOrThrow,
  updateOrderStatusOrThrow,
  updatePaymentStatusOrThrow,
  getOrderByIdOrThrow,
  getFullOrdersByCustomerIdAndStatusOrThrow
} from '../models/order.model.js';
import { generatePayNowQRCode } from '../services/payment.service.js';
import { canUpdatePaymentStatus } from '../utils/auth.utils.js';


/** SWAGGER DOCS
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order and generate payment instructions
 *     description: |
 *       Creates a new order and returns:
 *       - the full order object (including items),
 *       - a Base64-encoded PayNow QR code,
 *       - a payment reference string (e.g., SMUNCH-84-1),
 *       - and the PayNow mobile number.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customer_id, merchant_id, delivery_fee_cents, building, room_type, room_number, delivery_time, order_items]
 *             properties:
 *               customer_id:
 *                 type: integer
 *               merchant_id:
 *                 type: integer
 *               delivery_fee_cents:
 *                 type: integer
 *               building:
 *                 type: string
 *               room_type:
 *                 type: string
 *               room_number:
 *                 type: string
 *               delivery_time:
 *                 type: string
 *                 format: date-time
 *               order_items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [menu_item_id, quantity]
 *                   properties:
 *                     menu_item_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     customisations:
 *                       type: object
 *                     notes:
 *                       type: string
 *           example:
 *             customer_id: 1
 *             merchant_id: 5
 *             delivery_fee_cents: 100
 *             order_items:
 *               - menu_item_id: 25
 *                 quantity: 2
 *                 customisations: { "noodle": "yellow" }
 *                 notes: hello
 *               - menu_item_id: 26
 *                 quantity: 1
 *             building: sob
 *             room_type: Seminar Room
 *             room_number: 2-7
 *             delivery_time: "2025-06-05T12:00:00Z"
 *     responses:
 *       201:
 *         description: Order created and payment details returned
 *         content:
 *           application/json:
 *             example:
 *               order:
 *                 order_id: 84
 *                 customer_id: 1
 *                 total_amount_cents: 520
 *                 food_amount_cents: 420
 *                 delivery_fee_cents: 100
 *                 payment_reference: SMUNCH-84-1
 *                 payment_status: awaiting_payment
 *                 order_status: created
 *                 customer_confirmed: false
 *                 customer_confirmed_at: null
 *                 created_at: "2025-06-19T16:25:12.357568"
 *                 building: sob
 *                 room_type: Seminar Room
 *                 room_number: 2-7
 *                 delivery_time: "2025-06-05T12:00:00"
 *                 merchant_id: 5
 *                 items:
 *                   - order_item_id: 23
 *                     order_id: 84
 *                     menu_item_id: 25
 *                     quantity: 2
 *                     price_cents: 160
 *                     notes: hello
 *                     customisations:
 *                       noodle: yellow
 *                     created_at: "2025-06-19T16:25:12.476407"
 *                   - order_item_id: 24
 *                     order_id: 84
 *                     menu_item_id: 26
 *                     quantity: 1
 *                     price_cents: 100
 *                     notes: null
 *                     customisations: null
 *                     created_at: "2025-06-19T16:25:12.476407"
 *               qrCode: "data:image/png;base64,..."
 *               payment_reference: SMUNCH-84-1
 *               paynow_number: "96773374"
 */
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
 * @swagger
 * /api/orders/{orderId}/order-status:
 *   put:
 *     summary: Update order status
 *     description: |
 *       Updates the status of a specific order.
 *       Acceptable values:
 *       - created
 *       - payment_verified
 *       - preparing
 *       - collected_by_runner
 *       - delivered
 *       - completed
 *       - cancelled
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 example: delivered
 *                 enum: [
 *                    'created',
 *                    'payment_verified',
 *                    'preparing',
 *                    'collected_by_runner',
 *                    'delivered',
 *                    'completed',
 *                    'cancelled'
 *                  ]
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             example:
 *               order:
 *                 order_id: 84
 *                 customer_id: 1
 *                 total_amount_cents: 520
 *                 food_amount_cents: 420
 *                 delivery_fee_cents: 100
 *                 payment_reference: SMUNCH-84-1
 *                 payment_status: awaiting_payment
 *                 order_status: delivered
 *                 customer_confirmed: false
 *                 customer_confirmed_at: null
 *                 created_at: "2025-06-19T16:25:12.357568"
 *                 building: sob
 *                 room_type: Seminar Room
 *                 room_number: 2-7
 *                 delivery_time: "2025-06-05T12:00:00"
 *                 merchant_id: 5
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid order_status: 'lolol'. Allowed values: created, payment_verified, preparing, collected_by_runner, delivered, completed, cancelled"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Order with ID 84 does not exist"
 *               code: "NOT_FOUND_ORDER"
 */
/**
 * PUT /api/orders/:orderId/order-status
 *
 * Updates the status of a specific order.
 * Only accepts predefined status strings
 * - 'created'
 * - 'payment_verified'
 * - 'preparing'
 * - 'collected_by_runner'
 * - 'delivered'
 * - 'completed'
 * - 'cancelled'
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
 * 
 * @throws {Error} - If status is invalid or order not found
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
 * @swagger
 * /api/orders/{orderId}/payment-status:
 *   put:
 *     summary: Update payment status of an order
 *     description: |
 *       Updates the payment status of a specific order.
 *       
 *       **Access Rules**:
 *         - Admins can change payment status to any valid value.
 *         - Users can only change from `awaiting_payment` to `awaiting_verification` on their own orders.
 *       
 *       **Allowed values for `status`**:
 *         - `awaiting_payment`
 *         - `awaiting_verification`
 *         - `payment_confirmed`
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [awaiting_payment, awaiting_verification, payment_confirmed]
 *                 example: awaiting_verification
 *     responses:
 *       200:
 *         description: Payment status updated
 *         content:
 *           application/json:
 *             example:
 *               order:
 *                 order_id: 84
 *                 payment_status: awaiting_verification
 *                 order_status: created
 *                 other fields: ...
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid payment status: 'foo'. Allowed values: awaiting_payment, awaiting_verification, payment_confirmed"
 *       403:
 *         description: Forbidden — user not allowed to perform this update
 *         content:
 *           application/json:
 *             example:
 *               error: "You can only update your own orders."
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Order with ID 84 does not exist"
 *               code: "NOT_FOUND_ORDER"
 */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Check if status is valid
    if (!PAYMENT_STATUSES.includes(status)){
      return res.status(400).json({
        error: `Invalid payment status: '${status}'. Allow values: ${PAYMENT_STATUSES.join(', ')}`,
      });
    }

    // Check if user is allowed to update payment status
    const order = await getOrderByIdOrThrow(orderId);
    const { allowed, reason } = canUpdatePaymentStatus({
      role: req.user.role,
      userId: req.user.id,
      order,
      newStatus: status
    });

    if (!allowed) {
      return res.status(403).json({ error: reason });
    }

    // Update status
    const updatedOrder = await updatePaymentStatusOrThrow(orderId, status);
    res.json({ order: updatedOrder });
  } catch (err) {
    next(err);
  }
};

/** SWAGGER DOCS
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Get full orders for a user (with items)
 *     description: |
 *       Retrieves full orders for a specific user, filtered by optional `type` query:
 *       
 *       - `active`: returns in-progress orders (created, payment_verified, preparing, collected_by_runner, delivered)
 *       - `history`: returns past orders (completed or cancelled)
 *       
 *       If `type` is not provided, returns all orders.
 *       Supports pagination using `limit` and `offset` query params.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, history]
 *         description: Filter orders by type
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Max number of orders to return (default: 10)"
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Number of records to skip (default: 0)"
 *     responses:
 *       200:
 *         description: List of full orders (with order items)
 *         content:
 *           application/json:
 *             example:
 *               orders:
 *                 - order_id: 76
 *                   customer_id: 2
 *                   order_status: created
 *                   order_items:
 *                     - quantity: 1
 *                       price_cents: 250
 *                       menu_items:
 *                         name: Coffee
 *       400:
 *         description: Invalid query parameter
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid type: 'foo'. Allowed values: active, history"
 *               code: "INVALID_QUERY_PARAM"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User with ID 2 does not exist"
 *               code: "NOT_FOUND_USER"
 */
/**
 * GET /api/orders/user/:userId?type=active|history&limit=10&offset=0
 * Retrieves full orders (including items) for a specific user.
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { type, limit = 10, offset = 0 } = req.query;
    let statuses;
    if (type === 'active') {
      statuses = [
        ORDER_STATUSES[0],             // order placed, awaiting payment
        ORDER_STATUSES[1],             // payment verified
        ORDER_STATUSES[2],             // merchant preparing order (optional, future dev)
        ORDER_STATUSES[3],             // in transit
        ORDER_STATUSES[4]              // food delivered, not yet confirmed by user
      ];
    } else if (type === 'history') {
      statuses = [
        ORDER_STATUSES[5],             // user confirmed receipt
        ORDER_STATUSES[6]              // user or system cancelled
      ];
    } else if (type !== undefined) {
        return res.status(400).json({
          error: `Invalid type: '${type}'. Allowed values: active, history`,
          code: 'INVALID_QUERY_PARAM'
      });
    } // Allow lack of type to fall through

    // convert limit and offset into the correct types to put into method, and make sure they are reasonable (within 50)
    const safeLimit = Math.min(Number(limit) || 10, 50);
    const safeOffset = Number(offset) || 0;


    const orders = await getFullOrdersByCustomerIdAndStatusOrThrow(userId, statuses || [], safeLimit, safeOffset);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};
