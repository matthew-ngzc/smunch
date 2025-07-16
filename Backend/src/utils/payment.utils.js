
/**
 * Converts an amount in cents to a formatted dollar string with 2 decimal places.
 * 
 * Example:
 *   formatCentsToDollars(520) → "5.20"
 *   formatCentsToDollars(1230) → "12.30"
 *   formatCentsToDollars(0) → "0.00"
 * 
 * @param {number} cents - The amount in cents
 * @returns {string} - The formatted dollar string (e.g., "4.20")
 */
export function formatCentsToDollars(cents) {
  return (cents / 100).toFixed(2);
}