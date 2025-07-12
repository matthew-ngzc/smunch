import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { updateUserProfilePictureUrl } from '../controllers/user.controller.js';

const router = express.Router();

// POST /api/user/profile-picture-url
router.post(
  '/profile-picture-url',
  authenticateToken,
  updateUserProfilePictureUrl
);

export default router;
