import {
  createOrderOrThrow,
  updateOrderStatusOrThrow,
  getOrdersByUserIdOrThrow
} from '../models/order.model.js';

/**
 * POST /api/orders
 * Creates a new order.
 */
export const createOrder = async (req, res, next) => {
  try {
    const newOrder = await createOrderOrThrow(req.body);
    res.status(201).json({ order: newOrder });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/orders/:orderId/status
 * Updates the status of an existing order.
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
    const orders = await getOrdersByUserIdOrThrow(userId, statuses);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};
