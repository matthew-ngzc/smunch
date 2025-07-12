<script setup>
import { computed } from 'vue'
import { formatDateTime, formatLocation, formatStatusClass, formatStatus } from '@/utility/orderHelpers'

const props = defineProps({
  order: Object,
  onClose: Function
})

const itemCount = computed(() => props.order.items?.length || 1)
const total = computed(() => (props.order.total_amount_cents / 100).toFixed(2))
</script>
<template>
  <div class="receipt-backdrop" @click.self="onClose">
    <div class="receipt-container">
      <div class="receipt-header-row">
        <button class="back-button" @click="onClose">
            ← 
        </button>
        <h2>Order Receipt</h2>
    </div>

      <div class="receipt-order-header">
        <img :src="order.merchant.image_url" alt="Merchant Logo" class="receipt-logo" />
        <div class="order-details">
          <p><strong>Order #{{ order.order_id }}</strong></p>
          <p>Payment Reference: {{ order.payment_reference }}</p>
          <p>Location: {{ formatLocation(order) }}</p>
          <p>Merchant: {{ order.merchant.name }}</p>
          <p>Deliver date and time: {{ formatDateTime(order.delivery_time) }}</p>
          <p>Order placed at: {{ formatDateTime(order.created_at) }}</p>
        </div>
        <div class="order-summary">
          <p>{{ itemCount }} item<span v-if="itemCount > 1">s</span></p>
          <p class="price">${{ total }}</p>
          <span class="status-badge" :class="formatStatusClass(order.payment_status)">
            {{ formatStatus(order.payment_status) }}
          </span>
        </div>
      </div>

      <hr />

      <div class="receipt-body">
        <h3>Order Summary</h3>
        <ul>
          <li v-for="item in order.items" :key="item.id">
            {{ item.name }}
            <ul>
              <li v-for="option in item.options" :key="option">{{ option }}</li>
            </ul>
          </li>
        </ul>

        <div class="totals">
          <p>Subtotal: ${{ ((order.total_amount_cents - 100) / 100).toFixed(2) }}</p>
          <p>Delivery fee: ${{ (order.delivery_fee_cents / 100).toFixed(2) }}</p>
          <p><strong>Total: ${{ total }}</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.receipt-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.receipt-container {
  background: white;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  width: 95%;
  max-width: 850px; /* wider modal */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.receipt-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.receipt-header-row h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
}

.back-button {
  background: none;
  border: none;
  font-size: 1rem;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #2c3e50;
  transition: background 0.2s;
}

.back-button:hover {
  background: #f0f0f0;
}

.receipt-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-right: 1rem;
}

.receipt-order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.order-details {
  flex: 2;
  font-size: 1rem;
}

.order-summary {
  text-align: right;
  flex: 1;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-top: 6px;
}

.receipt-body {
  margin-top: 2rem;
}

.receipt-body h3 {
  margin-bottom: 1rem;
}

.receipt-body ul {
  list-style: none;
  padding-left: 0;
}

.receipt-body li {
  font-weight: bold;
  margin-top: 0.5rem;
}

.receipt-body li ul {
  font-weight: normal;
  color: #555;
  padding-left: 1.2rem;
}

.totals {
  margin-top: 1.5rem;
  font-size: 1rem;
}

.order-details p,
.order-summary p {
  margin: 0.3rem 0;
}

</style>
