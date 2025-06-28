import express from 'express';
import { 
    signup, 
    login, 
    verifyAndCreateUser,
    requestMerchantSignup,
    verifyMerchantSignupToken,
    completeMerchantSignup
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup); //start signup process, send verification email
router.post('/login', login); //login user with email and password
router.get('/verify', verifyAndCreateUser); // verify signup token and create user

// merchant signup routes
router.post('/merchant/request-signup', requestMerchantSignup);      // Step 1
router.get('/merchant/verify-signup', verifyMerchantSignupToken);    // Step 2
router.post('/merchant/complete-signup', completeMerchantSignup);    // Step 3

export default router;
