import cron from 'node-cron';
import { runOneDayBeforeReminders, runFinalCallReminders } from './emails.cron.js';

// Schedule 9PM daily for next-day payment reminder email
cron.schedule('0 21 * * *', async () => {
  console.log('[CRON] Running: One-day-before reminders (9PM)');
  await runOneDayBeforeReminders();
}, { timezone: 'Asia/Singapore' });

//* TESTING
// cron.schedule('*/5 * * * * *', async () => {
//   try {
//     console.log('[CRON] Running: One-day-before reminders (9PM)');
//     await runOneDayBeforeReminders();
//   } catch (err) {
//     console.error('[NODE-CRON] [ERROR]', err.message, err.stack);
//   }
// });

// Schedule for the final payment reminder email for the 4 diff timeslots

// cron.schedule('20 11 * * *',    () => runFinalCallReminders('12:00'));
// cron.schedule('50 14 * * *',    () => runFinalCallReminders('15:30'));
// cron.schedule('20 18 * * *',    () => runFinalCallReminders('19:00')); 

// 8.15am
cron.schedule('35 7 * * *', async () => {
  try {
    await runFinalCallReminders('08:15');
  } catch (err) {
    console.error('[CRON] [ERROR]', err.message, err.stack);
  }
}, { timezone: 'Asia/Singapore' });
// 12.00pm
cron.schedule('20 11 * * *', async () => {
  try {
    await runFinalCallReminders('12:00');
  } catch (err) {
    console.error('[CRON] [ERROR]', err.message, err.stack);
  }
}, { timezone: 'Asia/Singapore' });
// 3.30pm
cron.schedule('50 14 * * *', async () => {
  try {
    await runFinalCallReminders('15:30');
  } catch (err) {
    console.error('[CRON] [ERROR]', err.message, err.stack);
  }
}, { timezone: 'Asia/Singapore' });
// 7.00pm
cron.schedule('20 18 * * *', async () => {
  try {
    await runFinalCallReminders('19:00');
  } catch (err) {
    console.error('[CRON] [ERROR]', err.message, err.stack);
  }
}, { timezone: 'Asia/Singapore' });

//* TESTING
// cron.schedule('*/5 * * * * *', async () => {
//   try {
//     await runFinalCallReminders('08:15');
//   } catch (err) {
//     console.error('[NODE-CRON] [ERROR]', err.message, err.stack);
//   }
// });

console.log('[CRON] Email schedulers initialized');