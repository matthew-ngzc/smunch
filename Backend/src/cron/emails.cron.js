import { getUserByIdOrThrow } from '../models/user.model.js';
import { 
    getOrdersForOneDayBeforeReminder,
    updateOrderReminderTimestamp, 
    getOrdersForFinalCallReminderBySlot
} from '../models/order.model.js';
import { 
    sendReminderEmailOneDayBefore, 
    sendReminderEmailFinalCall 
} from '../utils/mailer.js';
import { DateTime } from 'luxon';


// 1 day before reminder
export async function runOneDayBeforeReminders() {
  

  const sgNow = DateTime.now().setZone('Asia/Singapore');
  const tomorrow = sgNow.plus({ days: 1 });
  const deliveryDateISO = tomorrow.toISODate(); // → e.g. "2025-07-19"

  console.log(`[CRON] Sending 1-day-before reminders for ${deliveryDateISO}`);

  const orders = await getOrdersForOneDayBeforeReminder(deliveryDateISO);

  for (const order of orders) {
    try {
      const user = await getUserByIdOrThrow(order.customer_id);
      if (!user.email) continue;

      await sendReminderEmailOneDayBefore(user, order);
      await updateOrderReminderTimestamp(order.order_id, 'reminder_1_day_before_sent_at');
      console.log(`[Reminder Email 1-Day-Before] email sent succesfully for Order ${order.order_id}`);
    } catch (err) {
      console.error(`[Reminder Email 1-Day-Before] Failed for Order ${order.order_id}: ${err.message}`);
    }
  }

  console.log(`[OneDayBefore Reminder] Done. ${orders.length} checked.`);
}

// Last reminder to pay
export async function runFinalCallReminders(slot) {
  console.log(`[CRON] Running final call reminders for slot: ${slot}`);

  if (!slot) {
    console.warn(`[FinalCall Reminder] Slot not provided. Aborting.`);
    return;
  }
  const {orders, deliveryTimeISO} = await getOrdersForFinalCallReminderBySlot(slot);
  console.log(`[CRON] Running final call reminders for slot: ${slot} → ${deliveryTimeISO}`);


  for (const order of orders) {
    try {
      const user = await getUserByIdOrThrow(order.customer_id, 'user_id, name, email');
      if (!user.email) {
        console.log('[CRON] ERROR: no email for ')
        continue;
      }
      await sendReminderEmailFinalCall(user.email, user.name, order);
      await updateOrderReminderTimestamp(order.order_id, 'reminder_40_mins_before_sent_at');
    } catch (err) {
      console.error(`[Reminder Email Final Call] Failed for Order ${order.order_id}: ${err.message}`);
    }
  }

  console.log(`[FinalCall Reminder] Done. ${orders.length} checked.`);
}