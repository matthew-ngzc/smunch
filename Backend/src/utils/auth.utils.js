import { PAYMENT_STATUSES } from "../constants/enums.constants.js";

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
    if (role === 'admin') {
        return { allowed: true };
    }
    
    if (role !== 'user') {
        return { allowed: false, reason: 'Only users or admins may view or edit this order.' };
    }
    
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
  const { allowed, reason } = isCorrectUser({ role, userId, order });
  if (!allowed) {
    return { allowed, reason };
  }

  if (role !== 'user') {
    return { allowed: false, reason: 'Only users or admins may update payment status.' };
  }

  if (order.customer_id !== userId) {
    return { allowed: false, reason: 'You can only update your own orders.' };
  }

  if (order.payment_status !== PAYMENT_STATUSES[0]) {
    return {
      allowed: false,
      reason: `You can only update from '${PAYMENT_STATUSES[0]}'. Current status: '${order.payment_status}'.`,
    };
  }

  if (newStatus !== PAYMENT_STATUSES[1]) {
    return {
      allowed: false,
      reason: `Users can only change status to '${PAYMENT_STATUSES[1]}'.`,
    };
  }

  return { allowed: true };
}