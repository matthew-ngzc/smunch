import { chromium} from 'playwright';
import dotenv from 'dotenv';
import { all } from 'axios';
import fs from 'fs/promises';

dotenv.config({ path: '../../.env' });

const DBS_USERNAME = process.env.DBS_USERNAME;
const DBS_PASSWORD = process.env.DBS_PASSWORD;

const expectedPayments = new Map([
  ['SMUNCH12', { amount: 5.01, paid: false }],
  ['SMUNCH987654', { amount: 2.50, paid: false }],
  ['SMUNCH123456', { amount: 2.50, paid: false }],
]);

async function loginToDBS(page) {
  await page.goto('https://internet-banking.dbs.com.sg/IB/Welcome');
  await page.locator('#UID').fill(DBS_USERNAME);
  await page.locator('#PIN').fill(DBS_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page
    .locator('frame[name="user_area"]')
    .contentFrame()
    .locator('iframe[name="iframe1"]')
    .contentFrame()
    .getByRole('link', { name: 'Authenticate now' })
    .click();

  console.log('✅ Logged in. Please complete 2FA...');
  // await new Promise(resolve => {
  //   console.log('⏳ Press ENTER after completing 2FA.');
  //   process.stdin.once('data', resolve);
  // });
}

async function navigateToTransactionHistory(page) {
  const frame = await page
    .locator('frame[name="user_area"]')
    .contentFrame();

  await frame.getByRole('heading', { name: 'My Accounts' }).click();
  await frame.getByRole('link', { name: 'View Transaction History' }).click();

  const innerFrame = await frame
    .locator('iframe[name="iframe1"]')
    .contentFrame();

  // Select bank account
  await innerFrame.locator('#account_number_select').selectOption(
    '0011~02740263440000~null~03~null~null~SGD~Deposit'
  );
  console.log(' Selected Bank account');

//await page.locator('frame[name="user_area"]').contentFrame().locator('iframe[name="iframe1"]').contentFrame().locator('#account_number_select').selectOption('0011~02740263440000~null~03~null~null~SGD~Deposit')
  // Choose last 7 days
  await innerFrame.locator('#transPeriod').click();
  await innerFrame.getByRole('listitem').filter({ hasText: 'Last 7 Days' }).click();
  console.log(' Selected last 7 days');
  // Choose only incoming transactions
  await innerFrame.locator('#lstSortCasa').selectOption('Credit');
  console.log(' Selected credit');
  await innerFrame.getByRole('button', { name: 'Go' }).click();

  console.log('✅ Navigated to transaction history');
}

async function checkTransactionsInPage(page, expectedPayments) {
  // const transactionFrame = await page
  //   .frameLocator('frame[name="user_area"]')
  //   .frameLocator('iframe[name="iframe1"]');

  // const html = await transactionFrame.evaluate(() => document.documentElement.outerHTML);
  // console.log('Frame HTML snapshot:', html.slice(0, 5000));
  const iframeHandle = await page
  .frameLocator('frame[name="user_area"]')
  .locator('iframe[name="iframe1"]')
  .elementHandle();

  // Step 2: Get the actual Frame object
  const transactionFrame = await iframeHandle.contentFrame();

  // Step 3: Now you can evaluate safely
  const html = await transactionFrame.evaluate(() => document.documentElement.outerHTML);
  await fs.writeFile('frame-snapshot.html', html, 'utf-8');
  console.log('✅ Frame HTML saved to frame-snapshot.html');




  // Get all the transactions
  //const rows = await transactionFrame.locator('tbody > tr').all();
  const rows = await transactionFrame.locator('tbody > tr')
      //.filter({ has: transactionFrame.locator('td:nth-of-type(5)') }) // must have 5th td
      .all();


  for (const row of rows) {
    const tagNames = await row.evaluate((el) =>
      Array.from(el.children).map(child => child.tagName)
    );
    console.log('Row tag names:', tagNames);
    const tds = await row.locator('td').all();
    if (tds.length !== 5) {
      const textDump = await Promise.all(tds.map(cell => cell.innerText()));
      console.warn('❗️ Unexpected row format:', textDump.join(' | '));
      continue;
    }
    const textDump = await Promise.all(tds.map(cell => cell.innerText()));
    console.warn('Expected row format:', textDump.join(' | '));

    // Extract the details for each transaction (date, code, description, debit amt, credit amt)
    const date = await tds[0].innerText();
    console.log('Extracted date: ', date);
    const code = await tds[1].innerText();
    console.log('Extracted code: ', code);
    const descriptionRaw = await tds[2].innerText();
    console.log('Extracted desc: ', descriptionRaw);
    const debitRaw = await tds[3].innerText();
    console.log('Extracted debit: ', debitRaw);
    const creditRaw = await tds[4].innerText();
    console.log('Extracted credit: ', creditRaw);

    // Skip if not PayNow and incoming
    if (!descriptionRaw.toLowerCase().includes('paynow')) continue;
    //if (creditRaw.trim() === '') continue;


    // Extract reference number from description
    const referenceMatch = descriptionRaw.match(/SMUNCH[\d\s]+/i);
    const referenceRaw = referenceMatch?.[0]?.replace(/\s+/g, '').toUpperCase();
    // Skip if no such reference found in the transactions we are checking for (or no reference)
    if (!referenceRaw || !expectedPayments.has(referenceRaw)) continue;

    console.log(`\nProcessing transaction: ${date} | ${code} | ${descriptionRaw} | ${debitRaw} | ${creditRaw}`);

    // Extract amount paid
    const amount = parseFloat(creditRaw.replace(/[^\d.]/g, ''));
    // Expected will be { amount, paid: false } 
    const expected = expectedPayments.get(referenceRaw);

    if (Math.abs(amount - expected.amount) < 0.01) {
      expected.paid = true;
      expectedPayments.set(referenceRaw, expected);
      console.log(`✅ Payment matched: ${referenceRaw} - $${amount}`);
    }
  }
  // Summary:
  for (const [ref, data] of expectedPayments) {
    if (!data.paid) {
      console.log(`❌ NOT PAID: ${ref} - expected $${data.amount.toFixed(2)}`);
    }
    else{
      console.log(` PAID: ${ref} - expected $${data.amount.toFixed(2)}`);
    }
  }
}

// Main function to run script
(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await loginToDBS(page);
  await navigateToTransactionHistory(page);
  await checkTransactionsInPage(page, expectedPayments);

  // await context.close();
  // await browser.close();
})();

// (async () => {
//   //create browser and page
//   const browser = await chromium.launch({
//     headless: false
//   });
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   await page.goto('https://internet-banking.dbs.com.sg/IB/Welcome');

//   console.log('DBS Username:', DBS_USERNAME);
//   console.log('DBS Password:', DBS_PASSWORD);

//   // Login to DBS
//   //await page.locator('#UID').click();
//   await page.locator('#UID').fill(DBS_USERNAME);
//   //await page.locator('#PIN').click();
//   await page.locator('#PIN').fill(DBS_PASSWORD);
//   await page.getByRole('button', { name: 'Login' }).click();
//   await page.locator('frame[name="user_area"]').contentFrame().locator('iframe[name="iframe1"]').contentFrame().getByRole('link', { name: 'Authenticate now' }).click();
//   // at this point wait for the 2FA 
//   // Navigate to the transaction history page
  // await page.locator('frame[name="user_area"]').contentFrame().getByRole('heading', { name: 'My Accounts' }).click();
  // await page.locator('frame[name="user_area"]').contentFrame().getByRole('link', { name: 'View Transaction History' }).click();
  // await page.locator('frame[name="user_area"]').contentFrame().locator('iframe[name="iframe1"]').contentFrame().locator('#account_number_select').selectOption('0011~02740263440000~null~03~null~null~SGD~Deposit');
  // await page.locator('frame[name="user_area"]').contentFrame().locator('iframe[name="iframe1"]').contentFrame().locator('#transPeriod').click();
  // await page.locator('frame[name="user_area"]').contentFrame().locator('iframe[name="iframe1"]').contentFrame().getByRole('listitem').filter({ hasText: 'Last 7 Days' }).click();
  // await page.locator('frame[name="user_area"]').contentFrame().locator('iframe[name="iframe1"]').contentFrame().getByRole('button', { name: 'Go' }).click();

//   // Locate the transactions frame
//   const transactionFrame = await page
//     .frameLocator('frame[name="user_area"]')
//     .frameLocator('iframe[name="iframe1"]');

//   //get transactions
//   const transactions = transactionFrame.locator('td', all());

//   //Go through each transaction and chekc if it matches the reference and amount. If it does then set paid to true


//   // ---------------------
//   // await context.close();
//   // await browser.close();
// })();