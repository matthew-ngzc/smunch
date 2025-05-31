import { supabase } from '../lib/supabaseClient.js';
import bcrypt from 'bcryptjs';

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
    const err = new Error('User with this email does not exist');
    err.status = 404;
    throw err;
  }

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
  const { email, name, phoneNo, password } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{
      email,
      name,
      phone: phoneNo,
      hashed_password: hashedPassword
    }])
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
