import { ORDER_STATUSES, PAYMENT_STATUSES } from '../constants/enums.constants.js';

/**
 * Enhanced centralized error handler for Supabase/Postgres errors
 */
export default function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err); // <-- add this line
  const message = err.message || '';
  const code = err.code || '';

  // === ENUM: order_statuses
  if (message.includes('invalid input value for enum order_statuses')) {
    const match = message.match(/"(.*?)"/);
    const invalid = match ? match[1] : '[unknown]';
    return res.status(400).json({
      error: `Invalid order_status: '${invalid}'. Allowed values: ${ORDER_STATUSES.join(', ')}`
    });
  }

  // === ENUM: payment_statuses
  if (message.includes('invalid input value for enum payment_statuses')) {
    const match = message.match(/"(.*?)"/);
    const invalid = match ? match[1] : '[unknown]';
    return res.status(400).json({
      error: `Invalid payment_status: '${invalid}'. Allowed values: ${PAYMENT_STATUSES.join(', ')}`
    });
  }

  // === Foreign key violation (code 23503)
  if (code === '23503') {
    return res.status(400).json({
      error: 'Foreign key constraint failed',
      detail: err.detail || 'One of the referenced IDs does not exist'
    });
  }

  // === Not-null violation (code 23502)
  if (code === '23502') {
    return res.status(400).json({
      error: 'Missing required field',
      column: err.column || 'unknown',
      table: err.table || 'unknown'
    });
  }

  // === Unique constraint violation (code 23505)
  if (code === '23505') {
    return res.status(409).json({
      error: 'Duplicate value',
      detail: err.detail || 'A record with this value already exists'
    });
  }

  // === Manually thrown 404 errors
  if (err.status === 404) {
    return res.status(404).json({
      error: err.message || 'Resource not found',
      code: err.code || 'NOT_FOUND'
    });
  }

  // === Manually thrown 409 Conflict errors
  if (err.status === 409) {
    return res.status(409).json({
      error: err.message || 'Conflict',
      code: err.code || 'CONFLICT'
    });
  }

  // === Fallback
  return res.status(500).json({
    error: 'Internal Server Error',
    detail: message
  });
}
