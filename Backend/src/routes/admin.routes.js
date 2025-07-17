import express from 'express';
import { addMerchant, getPendingPayments, testEmail, verifyPayments } from '../controllers/admin.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Create a merchant. Account is not created, only merchant in merchant table
 * POST /api/admin/merchants
 * Must be logged in as admin
 */
router.post('/merchants', authenticateToken, requireRole('admin'), addMerchant); 

/**
 * Test the email service
 * POST /api/admin/email-test
 */
router.get('/email-test', testEmail);

/**
 * Get all orders that are awaiting payment verification
 * GET /api/admin/payments/pending
 * 
 * Protected: Admin only
 * Returns a list of orders with payment_status = 'awaiting_payment' or 'awaiting_verification'
 */
router.get('/payments/pending', authenticateToken, requireRole('admin'), getPendingPayments);

/**
 * Manually verify selected orders by payment reference, then call this to update db
 * @route POST /api/admin/payments/verify
 * 
 * @access: Admin only
 * sets payment_status to 'payment_confirmed' and order_status to 'payment_verified' for with paid:true
 */
router.post('/payments/verify', authenticateToken, requireRole('admin'), verifyPayments);

export default router;
