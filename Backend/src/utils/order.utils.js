import { formatCentsToDollars } from "./payment.utils.js";


/**
 * Extracts a *runner-friendly* list of line-items from a raw order row.
 *
 * @param {Object}  order                       – A single order record
 * @param {Array}   order.items                 – Items array fetched via JOIN
 * @param {number}  order.items[].quantity      – Quantity of this menu item
 * @param {number}  order.items[].price_cents   – (Unused here) item price
 * @param {string}  order.items[].notes         – “No ice”, “extra spicy”, …
 * @param {string}  order.items[].customisations– Free-text customisations
 * @param {Object}  order.items[].menu_items
 * @param {string}  order.items[].menu_items.name – Actual dish / drink name
 *
 * @returns {Array<{                             // One object per line-item
 *            name:           string,            // e.g. "Iced Kopi O"
 *            quantity:       number,            // e.g. 2
 *            notes:          string|undefined,  // e.g. "no ice"
 *            customisations: string|undefined   // e.g. "oat milk"
 *          }>}
 *
 * @example
 * const order = {
 *   items: [
 *     {
 *       quantity: 2,
 *       price_cents: 260,
 *       notes: "no ice",
 *       customisations: "oat milk",
 *       menu_items: { name: "Iced Kopi O" }
 *     },
 *     {
 *       quantity: 1,
 *       price_cents: 450,
 *       notes: "",
 *       customisations: "",
 *       menu_items: { name: "Kaya Toast Set" }
 *     }
 *   ]
 * };
 *
 * extractItems(order);
 *  ➜ [
 *    { name: "Iced Kopi O", quantity: 2, notes: "no ice", customisations: "oat milk" },
 *    { name: "Kaya Toast Set", quantity: 1, notes: "", customisations: "" }
 *  ]
 */
export function extractItems(order) {

  return (order.items || []).map(it => ({
    name:           it.menu_items?.name ?? 'Unknown item',
    quantity:       it.quantity,
    notes:          it.notes,
    customisations: it.customisations
  }));
}


/**
 * Group a set of orders by merchant so a runner gets one consolidated
 * “shopping list” per stall / vendor.
 *
 * @param {Array<Object>} orders              List of order rows
 *                                            (must include `merchant_id`,
 *                                             `merchant_name`,
 *                                             `total_amount_cents`, `items`)
 *
 * @returns {Array<{
 *            merchant_name:        string,
 *            total_amount_dollars: string,
 *            items_to_order: Array<{
 *              name:           string,
 *              quantity:       number,
 *              notes:          string|undefined,
 *              customisations: string|undefined
 *            }>
 *          }>}
 *
 * @example
 * const merchants = buildMerchantList(cluster.orders);
 */
export function buildMerchantList(orders) {
  const merchantMap = new Map();

  for (const order of orders) {
    const key = order.merchant_id;

    if (!merchantMap.has(key)) {
      merchantMap.set(key, {
        merchant_name: order.merchant_name,
        total_amount_cents: 0,
        items_to_order: new Map()        // itemKey → { name, qty, notes, customisations }
      });
    }

    const m = merchantMap.get(key);
    m.total_amount_cents += order.total_amount_cents;

    // merge items inside the same merchant
    for (const item of order.items || []) {
      const itemKey =
        item.menu_items.name + (item.notes || '') + (item.customisations || '');

      if (!m.items_to_order.has(itemKey)) {
        m.items_to_order.set(itemKey, {
          name: item.menu_items.name,
          quantity: 0,
          notes: item.notes,
          customisations: item.customisations
        });
      }
      m.items_to_order.get(itemKey).quantity += item.quantity;
    }
  }

  // Convert Map → Array and cents → dollars for the final payload
  return Array.from(merchantMap.values()).map(m => ({
    merchant_name: m.merchant_name,
    total_amount_dollars: formatCentsToDollars(m.total_amount_cents),
    items_to_order: Array.from(m.items_to_order.values())
  }));
}


/**
 * Returns the canonical room key used by the clustering / route logic.
 * Format: "<building>-<room_type>-<room_number>"
 *
 * @param {Object} order
 * @param {string} order.building
 * @param {string} order.room_type
 * @param {string} order.room_number  // e.g. "3-30"
 * @returns {string} "SCIS-seminar-3-30"
 */
export function extractRoomKey(order) {
  return `${order.building}-${order.room_type}-${order.room_number}`;
}
