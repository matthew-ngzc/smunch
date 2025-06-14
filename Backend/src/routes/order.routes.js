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

const router = express.Router();

// Create a new order
// POST /api/orders
router.post('/', createOrder);

// Update order status
// PUT /api/orders/:orderId/status
router.put('/:orderId/order-status', updateOrderStatus);

// Update payment status of an order
// PUT /api/orders/:orderId/status
router.put('/:orderId/payment-status', updatePaymentStatus);

// View orders for a user (active or history via query param `type`)
// GET /api/orders/user/:userId?type=active|history
router.get('/user/:userId', getUserOrders);

// Confirm payment and send receipt
// POST /api/orders/:orderId/payment/confirm
router.post('/:orderId/payment/confirm', confirmPaymentAndSendReceipt);

// Get payment instructions (regenerate QR code, reference number, paynowNumber.)
// GET /api/orders/:orderId/payment
router.get('/:orderId/payment', getPaymentInstructions);

export default router;