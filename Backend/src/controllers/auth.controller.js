import jwt from 'jsonwebtoken';
import redis from '../lib/redisClient.js';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '../utils/mailer.js';
import {
  getUserByEmailOrThrow,
  isEmailTakenOrThrow,
  createUserOrThrow,
  updateLastLoginOrThrow,
  verifyPassword,
} from '../models/user.model.js';
import { getMerchantByEmailOrThrow, updateMerchantByIdOrThrow } from '../models/merchant.model.js';




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
 * Body:
 *   - email: SMU email (required)
 *   - name: Full name (required)
 *   - phoneNo: Contact number (required)
 *   - password: Chosen password (required)
 * No auth header required.
 * 
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

    // TODO: store everything in redis, only put signupId in jwt token, which is the key in redis
    const signupId = uuidv4(); // generate unique signup ID. This is the key in redis, put this into jwt
    const redisKey = `signup:${signupId}`;
    // store in user detail in redis for 1 hour
    await redis.set(redisKey, JSON.stringify({ email, name, phoneNo, password }), 'EX', 3600);

    //create JWT token for email verification
    const token = jwt.sign({ redisKey, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    //Send verification email
    await sendVerificationEmail({ to: email, token, role: 'user'});

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
 * Query:
 *   - token: JWT received in the verification email
 *
 * No auth header required.
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

    //TODO: fetch (email, name, role) from jwt, (phoneNo, password) from redis
    const { redisKey, role } = decoded;

    //fetch user details from redis
    const stored = await redis.get(redisKey);
    // if not found in redis, return error
    if (!stored) return res.status(400).json({ message: 'Expired or invalid link' });
    //extract details
    const { email, name, phoneNo, password } = JSON.parse(stored); 
    //remove from redis after use
    await redis.del(redisKey); 

    //check that account has not already been verified
    if (await isEmailTakenOrThrow(email)) {
      return res.status(409).json({ message: 'Account has been activated' });
    }

    //create user in database
    await createUserOrThrow({ email, name, phoneNo, password, role });

    res.status(201).json({ message: 'Account successfully created. You may now log in.' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Verification link expired' });
    }
    next(err);
  }
};

/** SWAGGER DOCS
 * @swagger
 * /api/auth/merchant/request-signup:
 *   post:
 *     summary: Initiate merchant signup
 *     description: |
 *       Merchants can enter their email to request signup.  
 *       If their email matches a merchant record (pre-created by admin), a verification link is sent to their email.  
 *       If no match is found, a friendly error message is returned prompting them to contact support.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: merchant@example.com
 *     responses:
 *       200:
 *         description: Verification link sent to merchant's email
 *         content:
 *           application/json:
 *             example:
 *               message: Signup link has been sent to your email. Please check your inbox.
 *       404:
 *         description: Merchant email not registered
 *         content:
 *           application/json:
 *             example:
 *               message: Keen on working with us? Drop us an email at smunch.dev@gmail.com and we’ll help you get started!
 *       409:
 *         description: Merchant already linked to a user account
 *         content:
 *           application/json:
 *             example:
 *               message: There is already an account linked to this merchant. You may log in, or contact us at smunch.dev@gmail.com if you need help.
 */

/**
 * POST /api/auth/merchant/request-signup
 * Body: { email: "merchant@gmail.com" }
 * No auth header required.
 * 
 * Starts the signup process for merchants
 * if merchant with email exists, send email
 * else tells them to contact us via email for onboarding. Admin needs to create the merchant and add the email to ensure no fake merchants
 * and then sends a verification email containing a JWT token based on (email, merchant_id, name, role).
 * Account is not created yet, only email verified
 * TODO: email format validation
 * TODO: rate limit signup attempts
 * TODO: add reCAPTCHA to prevent spam
 */
export const requestMerchantSignup = async (req, res, next) =>{
  // db check for email
  try {
    const { email } = req.body;
    //if dont exist this method will throw NotFoundError
    const merchant = await getMerchantByEmailOrThrow(email, 'merchant_id, name');
    // check if already linked to an account
    if (merchant.user_id){
      return res.status(409).json({ message: `There is already an account linked to this merchant. You may log in, or contact us at ${process.env.SMUNCH_EMAIL}if you need help.`})
    }
    //send jwt in email
    const token = jwt.sign({ email, merchant_id: merchant.merchant_id, name: merchant.name, role: 'merchant'}, process.env.JWT_SECRET, {expiresIn: '1h'});
    await sendVerificationEmail({ to: email, token, role: 'merchant'});

    res.status(200).json({message: 'Signup link has been sent to your email. Please check your inbox.'});
  }catch (err){
    if (err.status === 404){
      return res.status(404).json({ message: `Keen on working with us? Drop us an email at ${process.env.SMUNCH_EMAIL} and we’ll help you get started!`})
    }
    next(err);
  }
}


/**
 * @swagger
 * /api/auth/merchant/verify-signup:
 *   get:
 *     summary: Verify merchant signup token
 *     description: |
 *       Verifies the JWT token sent to the merchant's email.  
 *       Used to pre-fill the signup form or validate the signup link.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: JWT token sent via email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token verified successfully
 *         content:
 *           application/json:
 *             example:
 *               email: merchant@example.com
 *               merchant_id: 123
 *               name: Merchant Name
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             example:
 *               message: Verification link expired or invalid
 */

/**
 * GET /api/auth/merchant/verify-signup
 * Query:
 *   - token: JWT from merchant signup email
 *
 * No auth header required.
 * No postman, click on link
 * Callback endpoint to continue signup process, where it asks for merchant's details
 */
export const verifyMerchantSignupToken = async (req, res, next) => {
  try {
    const {token} = req.query;
    let decoded;
    try{
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token'});
    }
    const {email, merchant_id, name} = decoded;

    // return to frontend for pre-filling and displaying name for peace of mind
    res.status(200).json({ email, merchant_id, name});
  } catch(err){
    next(err);
  }
}

/** SWAGGER DOCS
 * @swagger
 * /api/auth/merchant/complete-signup:
 *   post:
 *     summary: Complete merchant signup
 *     description: |
 *       Final step in merchant onboarding.  
 *       Requires a token from the invite email to be submitted.  
 *       Prevents bypassing the flow or creating unauthorized accounts.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, phoneNo, password]
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT sent via email invite
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               phoneNo:
 *                 type: string
 *                 example: "91234567"
 *               password:
 *                 type: string
 *                 example: SecretPass123
 *     responses:
 *       201:
 *         description: Merchant account created
 *         content:
 *           application/json:
 *             example:
 *               message: Merchant account created successfully. You may now log in.
 *       400:
 *         description: Missing token, invalid token, or merchant mismatch
 *         content:
 *           application/json:
 *             examples:
 *               missing_token:
 *                 summary: Token missing
 *                 value:
 *                   message: Missing token
 *               invalid_token:
 *                 summary: Token expired or malformed
 *                 value:
 *                   message: Invalid or expired token
 *               mismatch:
 *                 summary: Email or merchant ID in token did not match DB
 *                 value:
 *                   message: Merchant email or name do not match records. Please contact us for support.
 *       409:
 *         description: Account already exists
 *         content:
 *           application/json:
 *             example:
 *               message: Account has already been activated, please log in.
 */

/**
 * POST /api/auth/merchant/complete-signup
 * Body:
 *   - token: JWT from email (must match merchant_id + email)
 *   - name: Merchant's display name
 *   - phoneNo: Contact number
 *   - password: Chosen password
 *
 * No auth header required, but token must be valid.
 * final step in merchant onboarding, creates the merchant's user account with all the details
 * token makes sure that flow is not bypassed through the endpoint and that validation in the previous steps happens
 * Validates:
 * - Token authenticity and expiry
 * - Email and merchant_id match DB record
 * - Email has not already been used
 */
export const completeMerchantSignup = async (req, res, next) => {
  try{
    const { token, phoneNo, password } = req.body;
    // Validate token
    if (!token){
      return res.status(400).json({message: 'Missing token'});
    }

    //extract merchant details from token
    let decoded;
    try{
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token'});
    }

    const {email, merchant_id, name} = decoded;

    // Recheck with db if email and name match
    const merchant = await getMerchantByEmailOrThrow(email, 'merchant_id, name');
    if (merchant.merchant_id !== merchant_id || merchant.name !== name){
      return res.status(400).json({ message: 'Merchant email or name do not match records. Please contact us for support.'});
    }
    //check if account has already been created
    if (await isEmailTakenOrThrow(email)){
      return res.status(409).json({ message: 'Account has already been activated, please log in.'});
    }

    // create merchant's user account
    const merchant_account = await createUserOrThrow({ email, name, phoneNo, password, role: 'merchant' });
    //update merchant to link to account
    await updateMerchantByIdOrThrow(merchant_id, { user_id: merchant_account.user_id});



    res.status(201).json({ message: 'Merchant account created successfully. You may now log in.'});
  } catch (err){
    next(err);
  }
}


/** SWAGGER DOCS
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: |
 *       Authenticates a user and returns a signed JWT along with basic user info.
 *       
 *       No authentication header is required.
 *       Returns a JWT that can be used in `Authorization: Bearer <token>` headers for protected routes.
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
 *               jwt_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user_id: 1
 *               name: Alice Tan
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
 * Body:
 *   - email: Registered email address
 *   - password: Account password
 *
 * No auth header required. Returns JWT in response.
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

    // Generate auth token using userid and role
    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Update last login (non-blocking)
    try {
      await updateLastLoginOrThrow(user.user_id);
    } catch (err) {
      console.warn(`[LOGIN] Failed to update last_login: ${err.message}`);
    }

    res.status(200).json({ jwt_token: token , user_id: user.user_id, name: user.name });
  } catch (err) {
    if (err.status === 404) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next(err);
  }
};

