import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { updateUserProfile, updateUserProfilePictureUrl } from '../controllers/user.controller.js';

const router = express.Router();

// POST /api/user/profile-picture-url
router.post(
  '/user/profile-picture-url',
  authenticateToken,
  updateUserProfilePictureUrl
);

// Update profile for current user
// PUT /api/users/profile
// Only updates fields provided in body (e.g. profile_picture, bio, password)
router.put('/users/profile', authenticateToken, updateUserProfile);

export default router;
