import express from 'express';
import {
  getAllMerchants,
  getMerchant,
  getMenu,
  updateMerchant,
  addMenuItem,
  updateMenuItem,
  getHiddenMenu,
} from '../controllers/merchant.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Get All Merchants
 * GET /api/merchants
 * Anybody can access
 */
router.get('/', getAllMerchants);

/**
 * Get specific merchant by ID
 * GET /api/merchants/:id
 * Anybody can access
 */
router.get('/:id', getMerchant);

/**
 * Get a specific merchant's menu
 * GET /api/merchants/:id/menu
 * Anybody can access
 */
router.get('/:id/menu', getMenu);



/**
 * Update a merchant's details (not menu)
 * PUT /api/merchants/:id
 * Must be logged in as merchant or admin
 */
router.put('/:id', authenticateToken, requireRole('merchant', 'admin'), updateMerchant);


/**
 * Get full menu for the authenticated merchant (including unavailable items)
 * GET /api/merchants/{id}/hiddenMenu
 * 🔒 Requires authentication as a merchant
 */
router.get('/:id/hiddenMenu', authenticateToken, requireRole('merchant', 'admin'), getHiddenMenu);

/**
 * Add a menu item for a specific merchant
 * POST /api/merchants/:id/menu
 * Must be logged in as merchant or admin
 */
router.post('/:id/menu', authenticateToken, requireRole('merchant', 'admin'), addMenuItem);

/**
 * Update the menu item for a specific merchant
 * POST /api/merchants/:merchantId/menu/:menuItemId
 * Must be logged in as merchant or admin
 */
router.put('/:merchantId/menu/:menuItemId', authenticateToken, requireRole('merchant', 'admin'),updateMenuItem);


export default router;
