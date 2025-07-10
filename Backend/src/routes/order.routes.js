import express from 'express';
import {
  createOrder,
  updateOrderStatus,
  getUserOrders,
  updatePaymentStatus
} from '../controllers/order.controller.js';
import { 
  confirmPaymentAndSendReceipt,
  getPaymentInstructions
 } from '../controllers/payment.controller.js';
 import { authenticateToken } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// Create a new order
// POST /api/orders
// Must be logged in as user / admin (cannot be merchant)
router.post('/', authenticateToken, requireRole('user', 'admin'), createOrder);

// Update order status
// PUT /api/orders/:orderId/status
// Must be logged in as admin
router.put('/:orderId/order-status', authenticateToken, requireRole('admin'), updateOrderStatus);

// Update payment status of an order
// PUT /api/orders/:orderId/status
// Must be logged in as admin
router.put('/:orderId/payment-status', authenticateToken, requireRole('admin'), updatePaymentStatus);

// View orders for a user (active or history via query param `type`)
// GET /api/orders/user/:userId?type=active|history
// Must be logged in as user
router.get('/user/:userId', authenticateToken, getUserOrders);

// Confirm payment and send receipt
// POST /api/orders/:orderId/payment/confirm
// TODO: Must be logged in as admin (keep for testing), default use cronjob / github actions
router.post('/:orderId/payment/confirm', confirmPaymentAndSendReceipt);

// Get payment instructions (regenerate QR code, reference number, paynowNumber.)
// GET /api/orders/:orderId/payment
// Must be logged in as the user with the corresponding order
//TODO: add role check and correct user check?
router.get('/:orderId/payment', authenticateToken, getPaymentInstructions);

export default router;