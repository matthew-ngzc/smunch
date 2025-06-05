import express from 'express';
import {
  getAllMerchants,
  getMerchant,
  getMenu,
  addMerchant,
  updateMerchant,
  addMenuItem,
  updateMenuItem,
} from '../controllers/merchant.controller.js';

const router = express.Router();

router.get('/', getAllMerchants);        // Get all merchants
router.get('/:id', getMerchant);        // Get specific merchant by ID
router.get('/:id/menu', getMenu);        // Get menu for a specific merchant
router.post('/', addMerchant);           // Add new merchant
router.put('/:id', updateMerchant);      // Update existing merchant
router.post('/:id/menu', addMenuItem);   // Add menu item to merchant with ID
router.put('/:merchantId/menu/:menuItemId', updateMenuItem) // Update menu item



export default router;
