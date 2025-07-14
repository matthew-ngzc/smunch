import { PAYMENT_STATUSES } from "../constants/enums.constants.js";
import axios from 'axios';
import dotenv from "dotenv";
import e from "express";

dotenv.config();

/**
 * Checks whether a user (or admin) is authorized to view or modify a given order.
 *
 * - Admins are always allowed.
 * - Users must match the customer ID of the order.
 * - All other roles are denied.
 *
 * @param {Object} params
 * @param {'admin' | 'user' | string} params.role - The role of the requester.
 * @param {number} params.userId - The user ID making the request.
 * @param {Object} params.order - The order being accessed.
 * @param {number} params.order.customer_id - The owner of the order.
 *
 * @returns {{ allowed: boolean, reason?: string }}
 *   Returns an object indicating whether the access is allowed,
 *   and an optional reason if denied.
 */
export function isCorrectUser({ role, userId, order}) {
    // admins are allowed
    if (role === 'admin') {
        return { allowed: true };
    }
    
    // not user and not admin
    if (role !== 'user') {
        return { allowed: false, reason: 'Only users or admins may view or edit this order.' };
    }
    
    // is user, check id matching anot
    if (order.customer_id !== userId) {
        return { allowed: false, reason: 'You can only view or edit your own orders.' };
    }
    
    return { allowed: true };
}


/**
 * Determines whether a user or admin is allowed to update the payment status of an order.
 *
 * - Admins can always update to any valid status.
 * - Users can only update from 'awaiting_payment' to 'awaiting_verification'
 *   and only on their own orders.
 *
 * This builds on the `isCorrectUser` function to enforce user-level access.
 *
 * @param {Object} params
 * @param {'admin' | 'user' | string} params.role - Role of the user making the request.
 * @param {number} params.userId - ID of the user making the request.
 * @param {Object} params.order - The order being updated.
 * @param {string} params.order.payment_status - Current payment status of the order.
 * @param {number} params.order.customer_id - ID of the customer who owns the order.
 * @param {string} params.newStatus - The desired new payment status.
 *
 * @returns {{ allowed: boolean, reason?: string }}
 *   Indicates whether the payment status update is permitted,
 *   with a reason if not allowed.
 */
export function canUpdatePaymentStatus({ role, userId, order, newStatus }) {
  // checks that is either admin, or the id matches if user
  const { allowed, reason } = isCorrectUser({ role, userId, order });
  if (!allowed) {
    return { allowed, reason };
  }

  // check that new payment status exists
  if (!PAYMENT_STATUSES.includes(newStatus)) {
    return {
      allowed: false,
      reason: `Invalid payment status: '${newStatus}'. Allowed: ${PAYMENT_STATUSES.join(', ')}`
    };
  }

  // admins can alr
  if (role === 'admin') {
    return { allowed: true };
  }

  // users need to check the before and after. Only can change from "awaiting payment" to "awaiting verification"
  if (order.payment_status !== PAYMENT_STATUSES[0] || newStatus !== PAYMENT_STATUSES[1]) {
    return {
      allowed: false,
      reason: `Users can only change status from '${PAYMENT_STATUSES[0]}' to '${PAYMENT_STATUSES[1]}'.`,
    };
  }

  return { allowed: true };
}


// * Verifies a Turnstile CAPTCHA token.
export async function verifyTurnstileToken(token, remoteip = '') {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const res = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', null, {
    params: {
      secret,
      response: token,
      remoteip
    }
  });

  return res.data.success;
}


// validates the fields sent in from the sign up form for users
export async function validateUserSignupInput({email, name, phoneNo, password}){
  // check that all fields present
  if (!email || !name || !phoneNo || !password){
    return { valid: false, message: 'All fields are required' };
  }
  
  // Email Checks
  let { valid, message } = await validateEmailFormat(email, false);
  if (!valid) return { valid, message };

  // name checking (alphanumeric, ' and -)
  if (!/^[a-zA-Z\s'-]{2,50}$/.test(name)) {
    return { valid: false, message: 'Name must be 2-50 characters, using only letters, spaces, hyphens, or apostrophes' };
  }

  // phone number checking (might remove)
  ({ valid, message } = validatePhoneNumber(phoneNo));
  if (!valid) return { valid, message };

  // password strength checking
  ({ valid, message } = await validatePasswordStrength(password));
  if (!valid) return { valid, message };

  return { valid: true };
}

export async function validateMerchantSignupInput({phoneNo, password}){

}

// email format checking
export async function validateEmailFormat(email, isMerchant = false){
  const cleanedEmail = email.trim();
  if (!isMerchant){
    // only allow SMU emails
    if (!email.endsWith('smu.edu.sg')) {
      return { valid: false, message: 'Only SMU emails allowed' };
    }
    // check for email structure (allows @scis.smu.edu.sg)
    const smuEmailRegex = /^[a-zA-Z0-9._%+-]+@([a-z]+\.)?smu\.edu\.sg$/i;
    if (!smuEmailRegex.test(cleanedEmail)) {
      return { valid: false, message: 'Invalid SMU email format' };
    }
  }
  else { // Merchant email checks (no need smu)
    const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!generalEmailRegex.test(cleanedEmail)) {
      return { valid: false, message: 'Invalid email format' };
    }
  }
  return { valid: true };
}

// Phone number checking
export function validatePhoneNumber(phoneNo) {
  if (!/^[689]\d{7}$/.test(phoneNo)) {
    return {
      valid: false,
      message: 'Phone number must be an 8-digit SG mobile starting with 6, 8, or 9. Exclude the +65'
    };
  }
  return { valid: true };
}

// password checking
export async function validatePasswordStrength(password){
  if (
    password.length < 8 || password.length > 128 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    return { valid: false, message: 'Password must be 8-128 characters with uppercase, lowercase, number, and symbol' };
  }
  return { valid: true };
}