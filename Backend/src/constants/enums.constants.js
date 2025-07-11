/**
 * Ordered list of order statuses.
 *
 * Index Mapping:
 * 
 *   0 → 'created'                // order created but not yet verified
 * 
 *   1 → 'payment_verified'       // payment confirmed, waiting for prep
 * 
 *   2 → 'preparing'              // food being prepared
 * 
 *   3 → 'collected_by_runner'    // picked up by runner
 * 
 *   4 → 'delivered'              // runner delivered to room
 * 
 *   5 → 'completed'              // user confirmed receipt
 * 
 *   6 → 'cancelled'              // order was cancelled
 */
export const ORDER_STATUSES = [
  'created',
  'payment_verified',
  'preparing',
  'collected_by_runner',
  'delivered',
  'completed',
  'cancelled'
];

/**
 * Ordered list of payment statuses.
 *
 * Index Mapping:
 * 
 *   0 → 'awaiting_payment'       // user just placed an order, hasn't paid
 * 
 *   1 → 'awaiting_verification'  // payment done, system/admin needs to verify
 * 
 *   2 → 'payment_confirmed'      // payment confirmed
 */
export const PAYMENT_STATUSES = [
  'awaiting_payment',
  'awaiting_verification',
  'payment_confirmed'
];
