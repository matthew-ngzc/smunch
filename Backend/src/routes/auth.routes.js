import express from 'express';
import { 
    signup, 
    login, 
    verifyAndCreateUser,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup); //start signup process, send verification email
router.post('/login', login); //login user with email and password
router.get('/verify', verifyAndCreateUser); // verify signup token and create user

export default router;
