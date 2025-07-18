

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