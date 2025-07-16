<script setup>
import { computed, ref } from 'vue'
import { formatDateTime as _formatDateTime, formatStatusClass, formatStatus } from '@/utility/orderHelpers'
import { getPaymentQRCode, updatePaymentStatus, getRefreshedOrders } from '@/services/orderFoodService'
import coins from '@/assets/smunch_coin.jpg';
import orderProgress from '../components/orderProgress.vue'


// define props passed into this component
// 'order' contains all the order details
// 'onClose' is a function to close the receipt modal
// 'showOrderStatus' determines if the UI shows order status (past) or payment status (active)
const props = defineProps({
  order: Object,
  onClose: Function,
  showOrderStatus: Boolean // true for past orders, false/undefined for active
})


const timelineData = computed(() => {
  const steps = [
    'Awaiting Payment',
    'Awaiting Verification',
    'Payment Confirmed',
    'Preparing',
    'Collected by Runner',
    'Delivered',
    'Completed'
  ]

  let currentStep = 0

  const payment = props.order.payment_status
  const status = props.order.order_status

  if (payment === 'awaiting_payment') {
    currentStep = 1
  } else if (payment === 'awaiting_verification') {
    currentStep = 2
  } else if (payment === 'payment_confirmed') {
    if (status === 'preparing') currentStep = 4
    else if (status === 'collected') currentStep = 5
    else if (status === 'delivered') currentStep = 6
    else if (status === 'completed') currentStep = 7
    else currentStep = 3 // payment confirmed but no order_status yet
  }

  return {
    steps,
    currentStep,
    activeColor: '#3BB143',
    passiveColor: '#ccc'
  }
})

// to reflect order status
function getCombinedStatus(order) {
  if (order.payment_status === 'awaiting_payment') return 'awaiting_payment'
  if (order.payment_status === 'awaiting_verification') return 'awaiting_verification'
  if (order.payment_status === 'payment_confirmed') {
    if (order.order_status === 'preparing') return 'preparing'
    if (order.order_status === 'collected') return 'collected_by_runner'
    if (order.order_status === 'delivered') return 'delivered'
    if (order.order_status === 'completed') return 'completed'
    return 'payment_confirmed'
  }
  return 'awaiting_payment'
}



// to refresh each specific order
const spinningOrderId = ref(null)

async function refreshOrderStatus(orderId) {
  if (!orderId || typeof orderId !== 'number') {
    console.error('invalid orderId in refreshOrderStatus:', orderId)
    return
  }

  spinningOrderId.value = orderId

  try {
    const res = await getRefreshedOrders(orderId)
    const refreshed = res.data

    // directly update the props.order values
    props.order.payment_status = refreshed.payment_status
    props.order.order_status = refreshed.order_status

    await new Promise(resolve => setTimeout(resolve, 600)) // allow spin to show
  } catch (err) {
    console.error('refresh error:', err)
  } finally {
    spinningOrderId.value = null
  }
}



// compute total item count by summing up quantities of all items in the order
const itemCount = computed(() => {
  if (!props.order.order_items) return 0
  return props.order.order_items.reduce((sum, item) => sum + (item.quantity || 1), 0)
})

// convert subtotal from cents to dollars and format to 2 decimal places
const subtotal = computed(() => (props.order.food_amount_cents / 100).toFixed(2))

// convert delivery fee from cents to dollars
const deliveryFee = computed(() => (props.order.delivery_fee_cents / 100).toFixed(2))

// compute total amount in dollars
const total = computed(() => (props.order.total_amount_cents / 100).toFixed(2))


// helper to format customisation key-value pairs as strings
function formatCustomisations(customisations) {
  if (!customisations || Object.keys(customisations).length === 0) return null;
  return Object.entries(customisations).map(([key, value]) => `${key}: ${value}`);
}

// formats delivery location string nicely from building, room type, and room number
function formatLocation(order) {
  let loc = ''
  if (order.building) loc += order.building.charAt(0).toUpperCase() + order.building.slice(1)
  if (order.room_type) loc += ', ' + order.room_type.charAt(0).toUpperCase() + order.room_type.slice(1)
  if (order.room_number) loc += ' ' + order.room_number
  return loc.trim()
}

// format a datetime with or without time depending on showTime flag
function formatDateTime(date, showTime) {
  const d = new Date(date)
  if (showTime) {
    return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
  }
  return d.toLocaleDateString('en-GB') + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
}

// return display text and css class for order status badge
function getOrderStatusBadge(order) {
  if (order.order_status === 'completed') {
    return { text: 'Completed', class: 'status-green' }
  } else if (order.order_status === 'cancelled') {
    return { text: 'Cancelled', class: 'status-red' }
  } else {
    return { text: order.order_status, class: 'status-grey' }
  }
}

// state for showing payment modal and loading states
const showPaymentModal = ref(false)
const paymentData = ref(null)
const loadingPayment = ref(false)
const paymentError = ref(null)

// triggered when user clicks on the 'click to pay' button
// fetches QR code and payment info from backend
async function handlePaymentClick() {
  loadingPayment.value = true
  paymentError.value = null
  try {
    const res = await getPaymentQRCode(props.order.order_id)
    paymentData.value = res.data
    showPaymentModal.value = true
  } catch (e) {
    paymentError.value = 'Failed to load payment details.'
  } finally {
    loadingPayment.value = false
  }
}

// closes the payment modal
function closePaymentModal() {
  showPaymentModal.value = false
}

// states for handling 'done' button click after user completes payment
const doneLoading = ref(false)
const doneError = ref(null)

// updates the payment status when user confirms they completed payment
async function handlePaymentDone() {
  doneLoading.value = true
  doneError.value = null
  try {
    await updatePaymentStatus(props.order.order_id)
    // immediately reflect new payment status in UI
    props.order.payment_status = 'awaiting_verification'
    closePaymentModal()
  } catch (e) {
    doneError.value = 'Failed to update payment status.'
  } finally {
  setTimeout(() => {
    spinningOrderId.value = null
  }, 1000) // delay 500ms so it has time to visibly spin
}
}
</script>


<template>
  <div class="receipt-backdrop" @click.self="onClose">
    <div class="receipt-box">
      <!-- back button -->
      <div class="receipt-header-row">
        <button class="back-button" @click="onClose" aria-label="Close receipt">←</button>
          <!-- title -->
        <div class="header-title-wrapper">
          <h2>Order Receipt</h2>
        </div>
      </div>
      <!-- order header: logo + info -->
    <div class="receipt-order-header">
  <img v-if="order.merchant?.image_url" :src="order.merchant.image_url" alt="Merchant Logo" class="receipt-logo" />

  <div class="order-info">
    <div class="order-title-row">
      <span class="order-id">Order {{ order.order_id }}</span>
    </div>

    <div class="order-meta">
      <div>Destination: School of {{ order.building.charAt(0).toUpperCase() + order.building.slice(1) }},  {{ order.room_number.charAt(0).toUpperCase() + order.room_number.slice(1) }} {{ order.room_type.charAt(0).toUpperCase() + order.room_type.slice(1) }} </div>
      <div>Merchant: {{ order.merchant?.name || order.merchant_id }}</div>
      <div>Pick up time: {{ formatDateTime(order.delivery_time) }}</div>
      <div>Reference No. : {{ order.payment_reference }}</div>
      <div class="order-placed">Order placed on {{ formatDateTime(order.created_at, true) }}</div>
    </div>
  </div>

  <div class="order-summary-right">

    <div class="status-row">
      <img v-if="order.order_status !== 'completed' && order.order_status !== 'cancelled'" src="/refreshImage.png" alt="refresh" class="refresh-icon" :class="{ spinning: spinningOrderId === props.order.order_id }" @click="refreshOrderStatus(props.order.order_id)" />


      <span v-if="showOrderStatus" :class="['status-badge', getOrderStatusBadge(order).class]">
        {{ getOrderStatusBadge(order).text }}
      </span>

      <template v-else>
        <button
          v-if="order.payment_status === 'awaiting_payment'"
          class="status-badge status-grey payment-btn"
          @click="handlePaymentClick"
          :disabled="loadingPayment"
        >
          <span v-if="!loadingPayment">Click here to make payment</span>
          <span v-else>Loading...</span>
        </button>
        <span v-else :class="['status-badge', formatStatusClass(getCombinedStatus(order))]">
          {{ formatStatus(getCombinedStatus(order)) }}
        </span>

      </template>
    </div>

    <div class="count-price">
      <div class="summary-count">  {{ itemCount }} item<span v-if="itemCount > 1">s</span>  </div>
      <div class="summary-price"> ${{ total }}</div>
    </div>
    <!-- Coin reward for completed orders in past orders view -->
    <div v-if="showOrderStatus && order.order_status === 'completed'" class="coin-reward">
      <span class="coin-text">+1</span>
      <img src="../assets/smunch_coin.jpg" alt="Smunch Coin" class="coin-icon-small" />
    </div>

  </div>
</div>

      <hr class="divider" />

      <!-- order Progress  -->
    <orderProgress :data="timelineData" />


      <!-- receipt body -->
      <div class="receipt-body">
        
        <div class="section-title">Order Summary</div>

        <div class="item-list">
          <div class="item-row" v-for="(item, idx) in order.order_items" :key="idx">
            <div class="item-name">
              {{ item.menu_items.name }}
              <span v-if="item.quantity > 0" class="item-qty">x{{ item.quantity }}</span>
            </div>
            <div class="item-price">
              ${{ ((item.price_cents * item.quantity) / 100).toFixed(2) }}
            </div>
          </div>
        </div>



        <div class="summary-table">
          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-value">${{ subtotal }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Delivery Fee</span>
            <span class="summary-value">${{ deliveryFee }}</span>
          </div>
          <div class="summary-row total">
            <span class="summary-label">Total</span>
            <span class="summary-value">${{ total }}</span>
          </div>
        </div>


        <div class="receipt-footer-message">Thank you for ordering with Smunch</div>
      </div>

      <!-- payment modal -->
      <div v-if="showPaymentModal" class="payment-modal-backdrop" @click.self="closePaymentModal">
        <div class="payment-modal-box">
          <button class="close-payment-modal" @click="closePaymentModal">×</button>

          <h2 class="payment-title">Follow the steps below to proceed with payment.</h2>

          <div class="payment-content">
            <div class="payment-steps">
              <div class="payment-step"><b>STEP 1:</b><br>
                PayNow <b>${{ total }}</b> via QR or Mobile to <b>{{ paymentData?.paynow_number }}</b>.<br>
                Enter your reference number <strong>{{ paymentData.payment_reference }}</strong> in the PayNow comments.<br />
              </div>
              <div class="payment-step"><b>STEP 2:</b><br>
                Send your payment screenshot to <b>@smunch_bot</b> via telegram.
              </div>
              <div class="payment-step"><b>STEP 3:</b><br>
                Press “done” once payment has been made!
              </div>
            </div>

            <div class="payment-qr-section">
              <img v-if="paymentData?.qrCode" :src="paymentData.qrCode" alt="PayNow QR" class="payment-qr" />
              <div class="paynow-recipient">Paynow recipient’s name: Matt</div>
            </div>
          </div>

          <div class="payment-confirm-msg">You will receive a confirmation from Smunch Admin within 1–2 days.</div>

          <button class="payment-done-btn" @click="handlePaymentDone" :disabled="doneLoading">
            <span v-if="!doneLoading">done</span>
            <span v-else>Processing...</span>
          </button>

          <div v-if="doneError" class="payment-error">{{ doneError }}</div>
          <div v-if="paymentError" class="payment-error">{{ paymentError }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.receipt-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.receipt-box {
  background: #fff;
  border: 1px solid #888;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 40px 48px;
  width: 1300px;
  max-width: 98vw;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
}


.receipt-header-row {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* for button */
}

/* back button */
.back-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #222;
  cursor: pointer;
}

/* title */
.header-title-wrapper {
  position: absolute;         /* take out of layout */
  left: 50%;                  /* start at middle */
  transform: translateX(-50%);/* pull left by 50% of its own width */
  font-size: 1.25rem;
  font-weight: bold;
}

.header-title-wrapper h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
}

.order-placed {
  font-size: 0.9rem;
  margin-top: 10px;
  margin-bottom: -5px;
  color: grey;
}

/* header layout */
.receipt-order-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin: 24px 0;
}

.receipt-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.order-title-row {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.order-id {
  font-weight: bold;
}
.order-meta {
  font-size: 1rem;
  color: #222;
}

.order-summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 2px;
  gap: 9px;
}

.status-row {
  display: flex;
  align-items: center;
  
}
.refresh-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform: translateY(3px); /* always applied */
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: translateY(3px) rotate(0deg);
  }
  to {
    transform: translateY(3px) rotate(360deg);
  }
}



.count-price {
  display: flex;
  gap: 14px;
}

.summary-count,
.summary-price {
  font-size: 1rem;
  color: #444;
  font-weight: 500;
}
.summary-price {
  font-weight: 700;
}

/* Coin reward styling for receipt */
.coin-reward {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: -3px;
}

.coin-text {
  font-size: 16px;
  font-weight: bold;
  color: #198754;
}

.coin-icon-small {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.status-badge {
  background: #444;
  color: #fff;
  border-radius: 16px;
  padding: 4px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  margin-left: 6px;
}

.status-green { background-color: #198754; }
.status-red   { background-color: #d63a00; }
.status-grey  { background-color: #6c757d; }
.status-yellow {
  background-color: #ffd600;
  color: #222;
  font-weight: 700;
}

/* divider line */
.divider {
  border: none;
  border-top: 1px solid #888;
  margin-top: -8px;
}

/* receipt body */
.receipt-body {
  margin-top: 16px;
}
.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
}

/* item list */
.item-list {
  margin-bottom: 47px;
  margin-top: 29px;
}
.item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 2px;
 
}
.item-name {
  display: flex;
  align-items: center;
  margin-left: 15px;
}
.item-qty {
  font-weight: 400;
  margin-left: 8px;
}
.item-notes {
  font-size: 1rem;
  color: #888;
  margin-left: 8px;
}


.summary-table {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.summary-label,
.summary-value {
  display: inline-block;
  margin: 0;
  padding: 0;
  font-weight: 500;
  
}

.summary-row.total .summary-value {
  font-weight: 700;
  font-size: 1.15rem;
}


/* footer message */
.receipt-footer-message {
  margin-top: 80px;
  text-align: center;
  font-size: 1.1rem;
  color: rgb(110, 110, 106);
  font-weight: 500;
}

/* payment button */
.payment-btn {
  border: none;
  background: #6c757d;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}
.payment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* payment modal */
.payment-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.18);
  z-index: 1100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.payment-modal-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 40px 48px;
  width: 1100px;
  max-width: 98vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.close-payment-modal {
  position: absolute;
  top: 18px;
  right: 24px;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
}
.payment-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
}
.payment-content {
  display: flex;
  gap: 40px;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 32px;
}
.payment-steps {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 1.1rem;
}
.payment-qr-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.payment-qr {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 8px;
}
.paynow-recipient {
  font-size: 1rem;
  color: #444;
  text-align: center;
}
.payment-confirm-msg {
  margin: 32px 0 16px;
  text-align: center;
  font-size: 1.1rem;
  color: #222;
}
.payment-done-btn {
  background: #17614a;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 40px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  margin: 16px auto 8px;
}
.payment-done-btn:hover {
  background: #198754;
}
.payment-error {
  color: #d63a00;
  margin-top: 12px;
  text-align: center;
}

/* responsive */
@media (max-width: 1000px) {
  .receipt-box {
    width: 98vw;
    padding: 16px;
  }
  .summary-row {
    width: 100%;
  }
}
</style>