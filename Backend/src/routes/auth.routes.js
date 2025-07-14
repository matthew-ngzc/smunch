import express from 'express';
import { 
    signup, 
    login, 
    verifyAndCreateUser,
    requestMerchantSignup,
    verifyMerchantSignupToken,
    completeMerchantSignup,
    forgotPassword,
    resetPassword
} from '../controllers/auth.controller.js';
import { rateLimit } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

//start signup process, send verification email. 
router.post('/signup', rateLimit({ keyPrefix: 'rate:signup', maxAttempts: 10, windowSeconds: 10 * 60}), signup); 
//login user with email and password, Rate limited to 10 attempts per 10 mins
router.post('/login', rateLimit({ keyPrefix: 'rate:login', maxAttempts: 10, windowSeconds: 10 * 60}), login); 
router.get('/verify', verifyAndCreateUser); // verify signup token and create user

// merchant signup routes
router.post('/merchant/request-signup', rateLimit({ keyPrefix: 'rate:merchant-signup', maxAttempts: 5, windowSeconds: 30 * 60 }), requestMerchantSignup);      // Step 1
router.get('/merchant/verify-signup', verifyMerchantSignupToken);    // Step 2
router.post('/merchant/complete-signup', completeMerchantSignup);    // Step 3

// forgot password routes
// POST /api/auth/forgot-password
// Rate limited to 5 attempts per 15 minutes
router.post(
  '/forgot-password', 
  rateLimit({ keyPrefix: 'rate:forgot-password', maxAttempts: 5, windowSeconds: 15 * 60 }),
  forgotPassword
);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
