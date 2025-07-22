import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { linkTelegramAccount } from '../controllers/telegram.controller.js';

const router = express.Router();

//router.post('/request-otp', authenticateToken ,getVerificationOtp);
router.post('/verifyTelegram', linkTelegramAccount);

export default router;