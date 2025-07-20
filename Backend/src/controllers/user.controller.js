import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { updateUserProfileOrThrow, updateUserProfilePicture } from '../models/user.model.js';
import { validatePasswordStrength } from '../utils/auth.utils.js';
import { sendPasswordChangeNotification } from '../utils/mailer.js';


/** 
 * @deprecated
 * Use the general profile update method instead
 */
export const updateUserProfilePictureUrl = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'No image URL provided' });
    }

    await updateUserProfilePicture(userId, imageUrl);
    res.json({ imageUrl });
  } catch (err) {
    next(err);
  }
};



/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update current user's profile
 *     description: |
 *       Allows a logged-in user to update their profile fields.  
 *       Only the provided fields will be updated.  
 * 
 *       **Possible fields to update:**
 *       - `profile_picture`: URL to a new profile image (stored as `profile_picture_url` in the database)
 *       - `bio`: Short text bio (max ~150 characters recommended)
 *       - `password`: New password (must pass strength validation and will be hashed). If resetting password, a notification email will be sent to the user
 * 
 *       Password updates must meet strength requirements and will be hashed before saving.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile_picture:
 *                 type: string
 *                 format: uri
 *                 example: "https://cdn.smunch.sg/avatars/student123.jpg"
 *                 description: URL to new profile picture
 *               bio:
 *                 type: string
 *                 example: "Coffee lover, SMU IS student"
 *                 description: "Short profile bio (max ~150 chars recommended)"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123!"
 *                 description: New password (must pass strength validation)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 user_id: 7
 *                 name: Alice Tan
 *                 email: student@smu.edu.sg
 *                 phone: "91234567"
 *                 profile_picture_url: "https://cdn.smunch.sg/avatars/student123.jpg"
 *                 bio: "Coffee lover, SMU IS student"
 *                 role: user
 *       400:
 *         description: Invalid input or password validation failed
 *         content:
 *           application/json:
 *             examples:
 *               no_fields:
 *                 summary: No fields to update
 *                 value:
 *                   message: "No fields to update"
 *               invalid_input:
 *                 summary: No user_id or no updates
 *                 value:
 *                   message: "Invalid input:: user_id and at least 1 update field required"
 *               weak_password:
 *                 summary: Password does not meet strength requirements
 *                 value:
 *                   message: "Password must contain at least 8 characters including 1 number and 1 uppercase letter"
 *       401:
 *         description: Unauthorized — token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 */
export const updateUserProfile = async (req, res, next) => {
  try{
    // extract information from body
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated properly' });
    }
    
    // extract userId from token
    const userId = req.user.id;

    let passwordChanged = false;
    const password_changed_at = new Date();

    // changes to make
    const updates = {};
    const fields = [ 'profile_picture', 'bio', 'password' ];
    for (const field of fields){
      if (req.body[field] !== undefined){
        // need to do password validation and hashing
        if (field === 'password'){
          // password strength validation
          const password = req.body.password;
          const { valid, message } = await validatePasswordStrength(password);
          if (!valid) return res.status(400).json({ message });
          // hashing
          updates.hashed_password = await bcrypt.hash(password, 10);
          // add time
          updates.password_changed_at = password_changed_at;
          passwordChanged = true;
        } 
        // every other field just add in
        else {
          updates[field] = req.body[field];
        }
      }
    }

    // check if there are any fields to update
    if (Object.keys(updates).length === 0){
      return res.status(400).json({ message: 'No fields to update' });
    }

    // update in db
    let updatedUser;
    try {
      updatedUser = await updateUserProfileOrThrow(userId, updates);
    } catch (dbError) {
      throw dbError;
    }

    // send email if the password was changed
    if (passwordChanged){
      await sendPasswordChangeNotification(updatedUser.email, updatedUser.name, updatedUser.password_changed_at);
    }
    return res.status(200).json({ user: updatedUser });
  }catch (err){
    console.error('Profile update error details:', err);
    next(err);
  }
}

/**
 * @swagger
 * /api/users/collections:
 *   put:
 *     summary: Update user's coins and dinosaur unlock status
 *     description: |
 *       Updates the current user's coins and dinosaur unlock status.
 *       Used by the Collections page when users unlock new dinosaurs.
 *       
 *       Both fields are optional - you can update just coins, just dino status, or both.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coins:
 *                 type: integer
 *                 minimum: 0
 *                 example: 200
 *                 description: New coin balance
 *               dinoUnlocked:
 *                 type: string
 *                 example: "Milo"
 *                 description: Name of the latest unlocked dinosaur
 *     responses:
 *       200:
 *         description: Collections data updated successfully
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 user_id: 16
 *                 name: "regan"
 *                 email: "regan@smu.edu.sg"
 *                 coins: 200
 *                 dino_unlocked: "Milo"
 *       400:
 *         description: Invalid input or no fields to update
 *         content:
 *           application/json:
 *             examples:
 *               no_fields:
 *                 summary: No fields provided
 *                 value:
 *                   message: "No fields to update"
 *               invalid_coins:
 *                 summary: Invalid coin value
 *                 value:
 *                   message: "Coins must be a non-negative integer"
 *       401:
 *         description: Unauthorized — token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 */
export const updateUserCoinsAndDinoStatus = async (req, res, next) => {
  try {
    // Extract user ID from JWT token
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated properly' });
    }
    
    // Handle both 'user_id' and 'id' field names from JWT token
    const userId = req.user.id;
    
    const { coins, dinoUnlocked } = req.body;
    
    // Build updates object
    const updates = {};
    
    // Validate and add coins if provided
    if (coins !== undefined) {
      if (!Number.isInteger(coins) || coins < 0) {
        return res.status(400).json({ message: 'Coins must be a non-negative integer' });
      }
      updates.coins = coins;
    }
    
    // Add dino unlock status if provided
    if (dinoUnlocked !== undefined) {
      updates.dino_unlocked = dinoUnlocked;
    }
    
    // Check if there are any fields to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    // Update in database
    const updatedUser = await updateUserProfileOrThrow(userId, updates);
    
    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error('Collections update error details:', err);
    next(err);
  }
};

/**
 * @swagger
 * /api/users/imagekit-auth:
 *   get:
 *     summary: Get ImageKit authentication parameters
 *     description: Generates signature, token, and expire parameters needed for secure ImageKit uploads from frontend
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authentication parameters generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Unique token for this upload session
 *                 expire:
 *                   type: number
 *                   description: Unix timestamp when token expires
 *                 signature:
 *                   type: string
 *                   description: HMAC signature for authentication
 *             example:
 *               token: "7_1672531200"
 *               expire: 1672531200
 *               signature: "abc123def456789..."
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: ImageKit configuration missing
 */
export const getImageKitAuthParams = async (req, res, next) => {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    
    if (!privateKey) {
      return res.status(500).json({ 
        message: 'ImageKit configuration missing' 
      });
    }

    // Generate token and expiry (ImageKit requires expire to be within 1 hour)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const userIdForToken = req.user?.user_id || req.user?.id;
    const token = userIdForToken ? `${userIdForToken}_${Date.now()}_${uniqueId}` : `default_${Date.now()}_${uniqueId}`;
    const expire = currentTimestamp + 600; // 10 minutes from now (well within 1 hour limit)
    
    // Create signature
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    res.json({
      token,
      expire,
      signature
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    next(error);
  }
};