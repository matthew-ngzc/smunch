import crypto from 'crypto';
import redis from '../lib/redisClient.js';
import { linkTelegramInfo, updateTelegramUsernameByTelegramId } from '../models/user.model.js';

/**
 * @swagger
 * /api/telegram/update-username:
 *   put:
 *     summary: Update Telegram username
 *     description: |
 *       Updates the Telegram username of a user based on their Telegram user ID.  
 *       This is called every time the bot is interacted with, to keep the username in sync.
 *     tags: [Telegram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [telegram_user_id, telegram_username]
 *             properties:
 *               telegram_user_id:
 *                 type: integer
 *                 example: 123456789
 *               telegram_username:
 *                 type: string
 *                 example: alice_smu
 *     responses:
 *       200:
 *         description: Telegram username updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Username updated"
 *               telegram_username: "alice_smu"
 *               smunch_user_id: 42
 *       400:
 *         description: Missing telegram_user_id or telegram_username
 *         content:
 *           application/json:
 *             example:
 *               message: "Missing telegram_user_id or telegram_username"
 *       404:
 *         description: Telegram user ID not linked to any SMUNCH account
 *         content:
 *           application/json:
 *             example:
 *               error: "User with telegram_user_id = 123456789 does not exist"
 *               code: "NOT_FOUND_USER"
 */
export const updateTelegramUsername = async (req, res, next) => {
  try {
    // extract info from request (from telegram bot)
    const { telegram_user_id, telegram_username } = req.body;
    if (!telegram_user_id || !telegram_username) {
      return res.status(400).json({ message: 'Missing telegram_user_id or telegram_username' });
    }

    const updatedUser = await updateTelegramUsernameByTelegramId(telegram_user_id, telegram_username);
    res.status(200).json({ message: 'Username updated', telegram_username: updatedUser.telegram_username, smunch_user_id: updatedUser.user_id });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/telegram/verifyTelegram:
 *   post:
 *     summary: Link Telegram account after OTP verification
 *     description: |
 *       Links a user's Telegram account to their SMUNCH account after verifying a 6-digit OTP and HMAC signature.  
 *       Used by the Telegram bot to finalize linking after user confirms the OTP in Telegram.
 *
 *       **Verification Flow:**
 *       1. OTP and Telegram ID are submitted from Telegram
 *       2. Signature is validated using HMAC-SHA256
 *       3. OTP is checked against Redis to prevent forgery
 *       4. Telegram details are stored in the user record
 *     tags: [Telegram]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp, telegram_user_id, telegram_username, signature]
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "739201"
 *               telegram_user_id:
 *                 type: integer
 *                 example: 123456789
 *               telegram_username:
 *                 type: string
 *                 example: alice_smu
 *               signature:
 *                 type: string
 *                 description: HMAC-SHA256 signature of `${otp}.${telegram_user_id}`
 *                 example: "f5a8cd8c2464..."
 *     responses:
 *       200:
 *         description: Telegram account linked successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Verification successful"
 *       400:
 *         description: OTP expired or invalid
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid or expired OTP"
 *       401:
 *         description: Signature mismatch
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid signature"
 */
export const linkTelegramAccount = async (req, res, next) => {
  //console.log('[DEBUG TELEBOT] starting verification');
    try{
        // check signature
        const {otp, telegram_user_id, telegram_username, signature} = req.body;
        const expectedSignature = crypto
            .createHmac('sha256',process.env.BOT_TOKEN)
            .update(`${otp}.${telegram_user_id}`)
            .digest('hex');
        if (signature !== expectedSignature){
            return res.status(401).json({ error: 'Invalid signature'});
        }
        
        //console.log('[DEBUG TELEBOT] parsing ok, signature ok');
        // get info from redis, double confirm that the otp is correct (if not ppl can just post req send fake otp)
        const cached = await redis.get(`otp:${otp}`);
        if (!cached){
            return res.status(400).json({error: 'Invalid or expired OTP'});
        }
        const {id} = JSON.parse(cached);
        //console.log('[DEBUG TELEBOT] fetched from redis');

        //put into db
        await linkTelegramInfo(id, telegram_user_id, telegram_username);
        //console.log('[DEBUG TELEBOT] put into db');
        
        //remove from redis
        await redis.del(`otp:${otp}`);
        return res.status(200).json({message: 'Verification successful'});
    }catch(err){
        next(err);
    }
}

//export const uploadPaymentScreenshot = async