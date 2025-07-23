import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { linkTelegramAccount, updateTelegramUsername } from '../controllers/telegram.controller.js';

const router = express.Router();


router.put('/update-username', updateTelegramUsername);

router.post('/verifyTelegram', linkTelegramAccount);

export default router;