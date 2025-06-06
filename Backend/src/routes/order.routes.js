import express from 'express';
import {
  createOrder,
  updateOrderStatus,
  getUserOrders
} from '../controllers/order.controller.js';

const router = express.Router();

// Create a new order
// POST /api/orders
router.post('/', createOrder);

// Update order status
// PUT /api/orders/:orderId/status
router.put('/:orderId/status', updateOrderStatus);

// View orders for a user (active or history via query param `type`)
// GET /api/orders/user/:userId?type=active|history
router.get('/user/:userId', getUserOrders);

export default router;