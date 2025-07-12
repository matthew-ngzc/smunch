import { updateUserProfilePicture } from '../models/user.model.js';

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