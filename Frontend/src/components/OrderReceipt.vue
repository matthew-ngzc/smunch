<script setup>
import { computed } from 'vue'
import { formatDateTime as _formatDateTime, formatStatusClass, formatStatus } from '@/utility/orderHelpers'

const props = defineProps({
  order: Object,
  onClose: Function
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
  // showTime: if true, show time in hh:mm am/pm, else show as in screenshot
  const d = new Date(date)
  if (showTime) {
    return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
  }
  return d.toLocaleDateString('en-GB') + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
}
</script>
<template>
  <div class="receipt-backdrop" @click.self="onClose">
    <div class="receipt-container">
      <div class="receipt-header-row">
        <button class="back-button" @click="onClose" aria-label="Close receipt">←</button>
        <h2>Order Receipt</h2>
      </div>
      <div class="receipt-box">
        <div class="receipt-order-header">
          <img v-if="order.merchant && order.merchant.image_url" :src="order.merchant.image_url" alt="Merchant Logo" class="receipt-logo" />
          <div class="order-details">
            <div class="order-title-row">
              <span class="order-id">Order {{ order.order_id }}</span>
              <span class="item-count">{{ itemCount }} item<span v-if="itemCount > 1">s</span></span>
              <span class="order-total">${{ total }}</span>
            </div>
            <div class="order-meta">
              <div>Destination : {{ formatLocation(order) }}</div>
              <div>Merchant : {{ order.merchant ? order.merchant.name : order.merchant_id }}</div>
              <div>Deliver date and time : {{ formatDateTime(order.delivery_time) }}</div>
              <div class="order-placed">Order placed on {{ formatDateTime(order.created_at, true) }}</div>
            </div>
          </div>
          <span class="status-badge" :class="formatStatusClass(order.payment_status)">
            {{ formatStatus(order.payment_status) }}
          </span>
        </div>
        <hr class="divider" />
        <div class="receipt-body">
          <div class="section-title">Order Summary</div>
          <div class="item-list">
            <div class="item-row" v-for="(item, idx) in order.order_items" :key="idx">
              <div class="item-name">
                {{ item.menu_items.name }}
                <span v-if="item.quantity > 1"> x{{ item.quantity }}</span>
              </div>
              <div v-if="item.notes" class="item-notes">{{ item.notes }}</div>
            </div>
          </div>
          <div class="summary-table">
            <div class="summary-row"><span>Subtotal</span><span>${{ subtotal }}</span></div>
            <div class="summary-row"><span>Current delivery fee</span><span>${{ deliveryFee }}</span></div>
            <div class="summary-row total"><span>Total</span><span>${{ total }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.receipt-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* dimmed overlay */
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.receipt-container {
  background: white;
  width: 90vw;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden; /* 🚫 disables horizontal scroll */
  border-radius: 12px;
  padding: 32px;
  box-sizing: border-box;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.receipt-header-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.back-button {
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: 400;
  cursor: pointer;
  color: #222;
  margin-right: 8px;
}
.receipt-header-row h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
}

.receipt-box {
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
}

.receipt-order-header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 16px;
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
.order-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
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
  margin-top: 0;
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
  flex-direction: column;
}
.item-customs {
  font-size: 1.1rem;
  font-weight: 400;
  color: #888;
  margin-left: 8px;
}
.custom-line {
  margin-bottom: 2px;
}
.item-notes {
  font-size: 1.1rem;
  color: #888;
  margin-left: 8px;
}
.summary-table {
  width: 100%;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.summary-row {
  display: flex;
  justify-content: flex-end;
  gap: 32px;
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 4px;
  width: 300px;
}
.summary-row span:first-child {
  flex: 1;
  text-align: left;
}
.summary-row span:last-child {
  min-width: 80px;
  text-align: right;
}
.summary-row.total {
  font-weight: 700;
}
@media (max-width: 1100px) {
  .receipt-box {
    width: 100vw;
    padding: 16px;
  }
  .summary-row {
    width: 100%;
    min-width: 0;
  }
}
</style>