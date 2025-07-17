import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { updateUserProfile, updateUserProfilePictureUrl, getImageKitAuthParams, updateUserCoinsAndDinoStatus } from '../controllers/user.controller.js';

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
router.put('/profile', authenticateToken, updateUserProfile);

// Update user's coins and dinosaur unlock status
// PUT /api/users/collections
router.put('/collections', authenticateToken, updateUserCoinsAndDinoStatus);

// Get ImageKit authentication parameters for secure uploads
// GET /api/users/imagekit-auth
router.get('/imagekit-auth', authenticateToken, getImageKitAuthParams);

export default router;