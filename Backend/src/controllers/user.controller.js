import bcrypt from 'bcryptjs';
import { updateUserProfileOr, updateUserProfileOrThrow, updateUserProfilePicture } from '../models/user.model.js';
import { validatePasswordStrength } from '../utils/auth.utils.js';


/** 
 * @deprecated
 * Use the general profile update method instead
 */
export const updateUserProfilePictureUrl = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
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
 *       - `password`: New password (must pass strength validation and will be hashed)
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
    const userId = req.user.user_id;

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
    const updatedUser = await updateUserProfileOrThrow(userId, updates);
    res.status(200).json({ user: updatedUser });
  }catch (err){
    next(err);
  }
}