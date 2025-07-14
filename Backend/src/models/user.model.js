import { supabase } from '../lib/supabaseClient.js';
import bcrypt from 'bcryptjs';
import { NotFoundError } from '../utils/error.utils.js';

/**
 * Retrieves a user by email and throws if not found.
 *
 * @param {string} email - User email address
 * @returns {Promise<object>} - The user object
 * @throws {Error} - If user is not found or query fails
 */
export async function getUserByEmailOrThrow(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    const err = new NotFoundError('User', 'email', email);
    err.status = 404;
    throw err;
  }

  return data;
}

/**
 * Fetches a user by ID and throws if not found.
 *
 * @param {number} userId - User ID
 * @param {string} fields - Comma-separated fields to select (default: 'user_id')
 * @returns {Promise<object>} - The user object
 * @throws {Error} - If user is not found or query fails
 */
export async function getUserByIdOrThrow(userId, fields = 'user_id') {
  const { data, error } = await supabase
    .from('users')
    .select(fields)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw NotFoundError('User', "ID", userId);

  return data;
}


/**
 * Checks whether an email is already registered.
 *
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - True if the email is in use
 * @throws {Error} - If the query fails
 */
export async function isEmailTakenOrThrow(email) {
  const { data, error } = await supabase
    .from('users')
    .select('user_id')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

/**
 * Creates a new user in the database.
 *
 * @param {object} payload - New user fields { email, name, phoneNo, password }
 * @returns {Promise<object>} - The created user object
 * @throws {Error} - If creation fails
 */
export async function createUserOrThrow(payload) {
  const { email, name, phoneNo, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{
      email,
      name,
      phone: phoneNo,
      hashed_password: hashedPassword,
      role
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}


/**
 * Updates an existing user's profile in the database.
 *
 * @param {number} userId - The ID of the user to update
 * @param {object} updates - A partial update map with any of the fields: profile_picture_url, bio, hashed_password, etc.
 * @returns {Promise<object>} - The updated user object
 * @throws {Error} - If update fails or user not found
 */
export async function updateUserProfileOrThrow(userId = 0, updates = {}){
  if (userId === 0 || Object.keys(updates).length === 0){
    const err = new Error('Invalid input:: user_id and at least 1 update field required');
    err.status = 400;
    throw err;
  }
  const {data, error} = await supabase
    .from('users')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Updates the last_login timestamp of a user.
 *
 * @param {number} userId - The user's ID
 * @returns {Promise<void>}
 * @throws {Error} - If update fails
 */
export async function updateLastLoginOrThrow(userId) {
  const { error } = await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Verifies user password against hash.
 *
 * @param {string} plainText - Raw password from login form
 * @param {string} hashedPassword - Hashed password from DB
 * @returns {Promise<boolean>} - True if match
 */
export async function verifyPassword(plainText, hashedPassword) {
  return await bcrypt.compare(plainText, hashedPassword);
}

/**
 * Updates the user's profile_picture field in Supabase.
 * @param {number} userId - The user's ID
 * @param {string} imageUrl - The public URL of the profile picture
 * @returns {Promise<void>}
 * @throws {Error} - If update fails
 */
export async function updateUserProfilePicture(userId, imageUrl) {
  const { error } = await supabase
    .from('users')
    .update({ profile_picture: imageUrl })
    .eq('user_id', userId);
  if (error) throw error;
}
