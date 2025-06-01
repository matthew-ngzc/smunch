import express from 'express';
import {
  getMerchants,
  getMenu,
  addMerchant,
  updateMerchant,
  addMenuItem,
  updateMenuItem,
} from '../controllers/merchant.controller.js';

const router = express.Router();

router.get('/', getMerchants);           // Get all merchants
router.get('/:id/menu', getMenu);        // Get menu for a specific merchant
router.post('/', addMerchant);           // Add new merchant
router.put('/:id', updateMerchant);      // Update existing merchant
router.post('/:id/menu', addMenuItem); // Add menu item to merchant with ID
router.put('/:merchantId/menu/:menuItemId', updateMenuItem) // Update menu item



export default router;
