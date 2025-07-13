<script setup>
import { computed, ref } from 'vue'
import { formatDateTime as _formatDateTime, formatStatusClass, formatStatus } from '@/utility/orderHelpers'
import { getPaymentQRCode, updatePaymentStatus } from '@/services/orderFoodService'

const props = defineProps({
  order: Object,
  onClose: Function,
  showOrderStatus: Boolean // true for past orders, false/undefined for active
})

const itemCount = computed(() => {
  if (!props.order.order_items) return 0
  return props.order.order_items.reduce((sum, item) => sum + (item.quantity || 1), 0)
})
const subtotal = computed(() => (props.order.food_amount_cents / 100).toFixed(2))
const deliveryFee = computed(() => (props.order.delivery_fee_cents / 100).toFixed(2))
const total = computed(() => (props.order.total_amount_cents / 100).toFixed(2))

function formatCustomisations(customisations) {
  if (!customisations || Object.keys(customisations).length === 0) return null;
  return Object.entries(customisations).map(([key, value]) => `${key}: ${value}`);
}

function formatLocation(order) {
  let loc = ''
  if (order.building) loc += order.building.charAt(0).toUpperCase() + order.building.slice(1)
  if (order.room_type) loc += ', ' + order.room_type.charAt(0).toUpperCase() + order.room_type.slice(1)
  if (order.room_number) loc += ' ' + order.room_number
  return loc.trim()
}

function formatDateTime(date, showTime) {
  const d = new Date(date)
  if (showTime) {
    return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
  }
  return d.toLocaleDateString('en-GB') + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
}

function getOrderStatusBadge(order) {
  if (order.order_status === 'completed') {
    return { text: 'Completed', class: 'status-green' }
  } else if (order.order_status === 'cancelled') {
    return { text: 'Cancelled', class: 'status-red' }
  } else {
    return { text: order.order_status, class: 'status-grey' }
  }
}

const showPaymentModal = ref(false)
const paymentData = ref(null)
const loadingPayment = ref(false)
const paymentError = ref(null)

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
function closePaymentModal() {
  showPaymentModal.value = false
}

const doneLoading = ref(false)
const doneError = ref(null)

async function handlePaymentDone() {
  doneLoading.value = true
  doneError.value = null
  try {
    await updatePaymentStatus(props.order.order_id)
    // Update the order's payment_status locally so UI updates immediately
    props.order.payment_status = 'awaiting_verification'
    closePaymentModal()
  } catch (e) {
    doneError.value = 'Failed to update payment status.'
  } finally {
    doneLoading.value = false
  }
}
</script>

<template>
  <div class="receipt-backdrop" @click.self="onClose">
    <div class="receipt-box">
      <div class="receipt-header-row">
        <button class="back-button" @click="onClose" aria-label="Close receipt">←</button>
      </div>
      <div class="header-title-wrapper">
        <h2>Order Receipt</h2>
      </div>
      <div class="receipt-order-header">
        <img v-if="order.merchant && order.merchant.image_url" :src="order.merchant.image_url" alt="Merchant Logo" class="receipt-logo" />
        <div class="order-details">
          <div class="order-title-row">
            <span class="order-id">Order {{ order.order_id }}</span>
            <span class="item-count">{{ itemCount }} item<span v-if="itemCount > 1">s</span></span>
          </div>
          <div class="order-meta">
            <div>Reference No. : {{ order.payment_reference }}</div>
            <div>Location : {{ formatLocation(order) }}</div>
            <div>Merchant : {{ order.merchant ? order.merchant.name : order.merchant_id }}</div>
            <div>Deliver date and time : {{ formatDateTime(order.delivery_time) }}</div>
            <div class="order-placed">Order placed on {{ formatDateTime(order.created_at, true) }}</div>
          </div>
        </div>
        <!-- Show only order status for past orders, only payment status for active orders -->
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
          <span v-else class="status-badge" :class="formatStatusClass(order.payment_status)">
            {{ formatStatus(order.payment_status) }}
          </span>
        </template>
      </div>
      <hr class="divider" />
      <div class="receipt-body">
        <div class="section-title">Order Summary</div>
        <div class="item-list">
          <div class="item-row" v-for="(item, idx) in order.order_items" :key="idx">
            <div class="item-name">
              {{ item.menu_items.name }}
              <span v-if="item.quantity > 1" class="item-qty">x{{ item.quantity }}</span>
            </div>
            <div v-if="item.notes" class="item-notes">{{ item.notes }}</div>
          </div>
        </div>
        <div class="summary-table">
          <div class="summary-row"><span>Subtotal</span><span>${{ subtotal }}</span></div>
          <div class="summary-row"><span>Delivery fee</span><span>${{ deliveryFee }}</span></div>
          <div class="summary-row total"><span>Total</span><span class="total-bold">${{ total }}</span></div>
        </div>
        <div class="receipt-footer-message">
          Thank you for ordering with Smunch
        </div>
      </div>
      <!-- Payment Modal -->
      <div v-if="showPaymentModal" class="payment-modal-backdrop" @click.self="closePaymentModal">
        <div class="payment-modal-box">
          <button class="close-payment-modal" @click="closePaymentModal">×</button>
          <h2 class="payment-title">Follow the steps below to proceed with payment.</h2>
          <div class="payment-content">
            <div class="payment-steps">
              <div class="payment-step"><b>STEP 1:</b><br>
                PayNow <b>${{ total }}</b> via QR or Mobile to <b>{{ paymentData?.paynow_number }}</b>.<br>
                Add transaction number in PayNow notes: <b>{{ paymentData?.payment_reference }}</b>.
              </div>
              <div class="payment-step"><b>STEP 2:</b><br>
                Send your payment screenshot to <b>@smunchAdmin</b> via telegram.
              </div>
              <div class="payment-step"><b>STEP 3:</b><br>
                Press “done” once payment has been made!
              </div>
            </div>
            <div class="payment-qr-section">
              <img v-if="paymentData?.qrCode" :src="paymentData.qrCode" alt="PayNow QR" class="payment-qr" />
              <div class="paynow-recipient">Paynow recipient’s Name: Smunch</div>
            </div>
          </div>
          <div class="payment-confirm-msg">
            You will receive a confirmation from Smunch Admin within 1–2 days.
          </div>
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
  padding: 40px 48px 40px 48px;
  width: 1300px;
  max-width: 98vw;
  max-height: 80vh;
  overflow-y: auto;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.receipt-header-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  justify-content: flex-start;
}
.back-button {
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: 400;
  cursor: pointer;
  color: #222;
  margin-right: 8px;
  position: static;
  left: 0;
  top: 0;
  transform: none;
}
.header-title-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}
.receipt-header-row h2,
.header-title-wrapper h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
}
.receipt-order-header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
  margin-top: 24px; 
  width: 100%;
}
.receipt-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-right: 16px;
}
.order-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.order-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}
.order-id {
  font-size: 1.5rem;
  font-weight: 700;
  margin-right: 16px;
}
.item-count {
  font-size: 1.1rem;
  color: #222;
  margin-right: 16px;
}
.status-badge {
  background: #444;
  color: #fff;
  border-radius: 20px;
  padding: 6px 20px;
  font-size: 1rem;
  font-weight: 600;
  margin-left: auto;
  margin-top: 8px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-green {
  background-color: #198754 !important;
  color: white !important;
}
.status-red {
  background-color: #d63a00 !important;
  color: white !important;
}
.status-grey {
  background-color: #6c757d !important;
  color: white !important;
}
.status-yellow {
  background-color: #ffd600 !important;
  color: #222 !important;
  font-weight: 700;
}
.order-meta {
  font-size: 1.1rem;
  color: #222;
  margin-bottom: 0;
}
.order-meta > div {
  margin-bottom: 2px;
}
.order-placed {
  font-size: 0.9rem;
  color: #444;
  margin-top: 8px;
}
.divider {
  border: none;
  border-top: 1px solid #888;
  margin: 16px 0 24px 0;
}
.receipt-body {
  margin-top: 16px;
}
.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 16px;
}
.item-list {
  margin-bottom: 32px;
}
.item-row {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.item-name {
  font-size: 1.1rem;
  font-weight: 600;
}
.item-qty {
  font-size: 1.1rem;
  font-weight: 400;
  margin-left: 8px;
}
.item-notes {
  font-size: 1.1rem;
  color: #888;
  margin-left: 8px;
}
.summary-table {
  width: 100%;
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.summary-row {
  width: 300px;
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  margin-bottom: 8px;
}
.summary-row.total .total-bold {
  font-weight: bold;
  font-size: 1.15em;
}
@media (max-width: 1000px) {
  .receipt-box {
    width: 98vw;
    padding: 16px;
  }
  .summary-row {
    width: 100%;
    min-width: 0;
  }
}

.receipt-footer-message {
  margin-top: 100px;
  text-align: center;
  font-size: 1.1rem;
  color: rgb(110, 110, 106);
  font-weight: 500;
}

.payment-btn {
  cursor: pointer;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 600;
  background: #6c757d;
  color: #fff;
  transition: background 0.2s;
}
.payment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.close-payment-modal {
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
.payment-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 32px;
}
.payment-content {
  display: flex;
  flex-direction: row;
  gap: 40px;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 32px;
}
.payment-steps {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 1.15rem;
}
.payment-step {
  margin-bottom: 8px;
}
.payment-qr-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}
.payment-qr {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
}
.paynow-recipient {
  font-size: 1rem;
  text-align: center;
  color: #444;
}
.payment-confirm-msg {
  margin: 32px 0 16px 0;
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
  margin: 0 auto;
  display: block;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 16px;
}
.payment-done-btn:hover {
  background: #198754;
}
.payment-error {
  color: #d63a00;
  margin-top: 12px;
  text-align: center;
}
</style>