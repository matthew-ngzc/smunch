import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/mailer.js';
import {
  getUserByEmailOrThrow,
  isEmailTakenOrThrow,
  createUserOrThrow,
  updateLastLoginOrThrow,
  verifyPassword,
} from '../models/user.model.js';




/** SWAGGER DOCS
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Start signup process by sending verification email
 *     description: |
 *       Verifies if email is valid and unique, then sends a verification email.
 *       Actual user account is created only after verifying the token from the email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, phoneNo, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email the user is signing up with (must be @smu.edu.sg)
 *                 example: student@smu.edu.sg
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: Alice Tan
 *               phoneNo:
 *                 type: string
 *                 description: User's phone number
 *                 example: "91234567"
 *               password:
 *                 type: string
 *                 description: Account password (plaintext at this stage)
 *                 example: MyPass123
 *     responses:
 *       200:
 *         description: Verification email sent
 *         content:
 *           application/json:
 *             example:
 *               message: Verification email sent. Please check your inbox.
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             example:
 *               message: Only SMU emails allowed
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             example:
 *               message: Account already exists
 */

/**
 * POST /api/auth/signup
 * Starts the signup process by verifying the email is allowed and not taken,
 * and then sends a verification email containing a JWT token.
 * Account is only created after verification.
 * TODO: password strength validation
 * TODO: email format validation
 * TODO: phone number format validation
 * TODO: rate limit signup attempts
 * TODO: add reCAPTCHA to prevent spam
 * TODO: prevent sql injection in email/password
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


/** SWAGGER DOCS
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verifies email token and creates account
 *     description: Accepts JWT token from email link and completes account creation
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: JWT token received in email
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             example:
 *               message: Account successfully verified. You may now log in.
 *       400:
 *         description: Missing or expired token
 *         content:
 *           application/json:
 *             example:
 *               message: Verification link expired
 *       409:
 *         description: Account already activated
 *         content:
 *           application/json:
 *             example:
 *               message: Account already activated
 */

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


/** SWAGGER DOCS
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticates a user and returns a signed JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 description: Registered SMU email address
 *                 example: student@smu.edu.sg
 *               password:
 *                 type: string
 *                 description: Account password
 *                 example: MyPass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR...
 *       400:
 *         description: Missing credentials
 *         content:
 *           application/json:
 *             example:
 *               message: Email and password are required
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid email or password
 */

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

