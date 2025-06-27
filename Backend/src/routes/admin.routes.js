import express from 'express';
import { addMerchant } from '../controllers/admin.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Create a merchant. Account is not created, only merchant in merchant table
 * POST /api/admin/merchants
 * Must be logged in as admin
 */
router.post('/merchants', authenticateToken, requireRole('admin'), addMerchant); 


export default router;
