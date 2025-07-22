import crypto from 'crypto';
import redis from '../lib/redisClient.js';
import { linkTelegramInfo, updateTelegramUsernameByTelegramId } from '../models/user.model.js';

// call this on every new interaction with the bot
export const updateTelegramUsername = async (req, res, next) => {
  try {
    // extract info from request (from telegram bot)
    const { telegram_user_id, telegram_username } = req.body;
    if (!telegram_user_id || !telegram_username) {
      return res.status(400).json({ message: 'Missing telegram_user_id or telegram_username' });
    }

    const updatedUser = await updateTelegramUsernameByTelegramId(telegram_user_id, telegram_username);
    res.status(200).json({ message: 'Username updated', telegram_username: updatedUser.telegram_username });
  } catch (err) {
    next(err);
  }
};

// linking tele account after verifying otp
export const linkTelegramAccount = async (req, res, next) => {
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

        // get info from redis, double confirm that the otp is correct (if not ppl can just post req send fake otp)
        const cached = await redis.get(`otp:${otp}`);
        if (!cached){
            return res.status(400).json({error: 'Invalid or expired OTP'});
        }
        const {id} = JSON.parse(cached);

        //put into db
        await linkTelegramInfo(id, telegram_user_id, telegram_username);
        
        //remove from redis
        await redis.del(`otp:${otp}`);
        return res.status(200).json({message: 'Verification successful'});
    }catch(err){
        next(err);
    }
}

//export const uploadPaymentScreenshot = async