import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/mailer.js';
import {
  getUserByEmailOrThrow,
  isEmailTakenOrThrow,
  createUserOrThrow,
  updateLastLoginOrThrow,
  verifyPassword,
} from '../models/user.model.js';


/**
 * POST /api/auth/signup
 * Starts the signup process by verifying the email is allowed and not taken,
 * and then sends a verification email containing a JWT token.
 * Account is only created after verification.
 * TODO: password strength validation
 * TODO: rate limit signup attempts
 */
export const signup = async (req, res, next) => {
  try {
    const { email, name, phoneNo, password } = req.body;
    //check if all fields are provided
    if (!email || !name || !phoneNo || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    //only allow SMU emails
    if (!email.endsWith('smu.edu.sg')) {
      return res.status(400).json({ message: 'Only SMU emails allowed' });
    }

    //prevent duplicate accounts
    if (await isEmailTakenOrThrow(email)) {
      return res.status(409).json({ message: 'Account already exists' });
    }
    //create JWT token for email verification
    const token = jwt.sign({ email, name, phoneNo, password }, process.env.JWT_SECRET, { expiresIn: '1h' });

    //Send verification email
    await sendVerificationEmail(email, token);

    res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (err) {
    next(err);
  }
};
/**
 * GET /api/auth/verify
 * No postman, click on link
 * Callback endpoint to complete signup.
 * Verifies the token and creates the user account if valid.
 */
export const verifyAndCreateUser = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Missing token' });

    //extract user details from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, name, phoneNo, password } = decoded;

    //check that account has not already been verified
    if (await isEmailTakenOrThrow(email)) {
      return res.status(409).json({ message: 'Account already activated' });
    }

    //create user in database
    await createUserOrThrow({ email, name, phoneNo, password });

    res.status(201).json({ message: 'Account successfully verified. You may now log in.' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Verification link expired' });
    }
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Logs in the user using email and password.
 * Returns a signed JWT token if credentials are valid.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and validate password
    const user = await getUserByEmailOrThrow(email);
    const isMatch = await verifyPassword(password, user.hashed_password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate auth token
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Update last login (non-blocking)
    try {
      await updateLastLoginOrThrow(user.user_id);
    } catch (err) {
      console.warn(`[LOGIN] Failed to update last_login: ${err.message}`);
    }

    res.status(200).json({ token });
  } catch (err) {
    if (err.status === 404) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next(err);
  }
};

