<script setup>
import { ref, onMounted } from 'vue'
import { getActiveOrders, getMerchantInfoById } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const activeOrders = ref([])
const merchant = ref()
// const merchantMap = ref({}) 
// const userId = '12345' // shayln: need login info -> replace with actual userid when user logs in

onMounted(async () => {
  const userId = authStore.userId  // reiwen: dynamically give the userId 
  try {
    const res = await getActiveOrders(userId)
    const orders = res.data.orders

    // now fetch merchant info for each order
    const ordersWithMerchant = await Promise.all(
      orders.map(async (order) => {
        const merchantRes = await getMerchantInfoById(order.merchant_id)
        order.merchant = merchantRes.data
        return order
      })
    )

    activeOrders.value = ordersWithMerchant
  } catch (error) {
    console.error('Failed to load active orders:', error)
  }
})

// not working yett
// function getItemCount(order) {
//   if (!order.items || !Array.isArray(order.items)) return 0
//   return order.items.reduce((sum, item) => sum + item.quantity, 0)
// }
function getItemCount(order) {
  // Update if your `order.items` is an array
  return order.items?.length || 1
}


function formatDateTime(datetime) {
  const date = new Date(datetime)
  return date.toLocaleDateString('en-GB') + ', ' + date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

function formatLocation(order) {
  return `${order.building.toUpperCase()}, ${order.room_type} ${order.room_number}`
}

function formatStatus(status) {
  switch (status) {
    case 'awaiting_payment': return 'Awaiting Payment'
    case 'payment_confirmed': return 'Payment Confirmed'
    case 'awaiting_verification': return 'Awaiting Verification'
    default: return status
  }
}

function getStatusClass(status) {
  return {
    'awaiting_payment': 'status-grey',
    'payment_confirmed': 'status-green',
    'awaiting_verification': 'status-yellow'
  }[status]
}

function getStatusMessage(status) {
  switch (status) {
    case 'awaiting_payment': return 'Payment not made.'
    case 'payment_confirmed': return 'Payment confirmed. We will deliver your order to you.'
    case 'awaiting_verification': return 'Order confirmed. Smunch will confirm your payment asap.'
    default: return ''
  }
}


</script>
<template>
  <div class="orders-page">
    <h2>Active Orders</h2>
    <ul class="orders-list">
      <li v-for="order in activeOrders" :key="order.order_id" class="order-card">
        <!-- merchant logo -->
        <img :src="order.merchant.image_url" alt="merchant logo" class="merchant-logo" />

        <!-- main order info -->
        <div class="order-info">
          <!-- top row -->
          <div class="order-header">
            <h3>Order #{{ order.order_id }}</h3>
            <div class="order-price-section">
              <span>{{ getItemCount(order) }} item<span v-if="getItemCount(order) > 1">s</span></span>
              <span class="order-price">${{ (order.total_amount_cents / 100).toFixed(2) }}</span>
            </div>
          </div>

          <!-- merchant + location -->
          <div class="order-details">
            <p>{{ order.pickup_location }}</p>
            <p>{{ order.merchant.name }}</p>
            <p class="pickup-time">
              Pick up time: {{ formatDateTime(order.delivery_time) }}
            </p>
          </div>

          <!-- status message and badge -->
          <div class="order-footer">
            <p class="payment-message">{{ getStatusMessage(order.payment_status) }}</p>
            <span
              class="status-badge"
              :class="getStatusClass(order.payment_status)"
            >
              {{ formatStatus(order.payment_status) }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.orders-page {
  padding: 20px;
  /* width: 100%;
  height: 100%; */
}

.orders-page h2 {
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 30px;
}

.orders-page ul {
  list-style: none;
  padding: 0;
}

.order-box {
  border: black;
  padding: 10px;
  margin: 19px;
}

.orders-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  align-items: flex-start;
  gap: 16px;
  background-color: white;
}

.merchant-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.order-info {
  flex: 1;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 6px;
}

.order-price-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.order-price {
  font-size: 16px;
  font-weight: bold;
}

.order-details p {
  margin: 2px 0;
  color: #444;
}

.pickup-time {
  font-weight: bold;
  margin-top: 4px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.payment-message {
  font-size: 14px;
  color: #333;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  min-width: 80px;
  text-align: center;
}

.status-badge.confirmed {
  background-color: green;
}

.status-badge.pending {
  background-color: #555;
}

.status-green {
  background-color: green;
  color: white;
}

.status-grey {
  background-color: #555;
  color: white;
}

.status-yellow {
  background-color: gold;
  color: black;
}

</style>

<!-- <template>
  <div class="orders-page">
    <h2>Active Orders</h2>

    <div class="order-card" v-for="order in activeOrders" :key="order.order_id">
      <div class="order-header">
        <img :src="getMerchantLogo(order.merchant_id)" alt="Merchant Logo" class="merchant-logo" />
        <div class="order-info">
          <div class="order-id">Order {{ order.order_id }}</div>
          <div class="location">{{ formatLocation(order) }}</div>
          <div class="merchant-name">{{ getMerchantName(order.merchant_id) }}</div>
          <div class="pickup-time">Pick up time: {{ formatDateTime(order.delivery_time) }}</div>
        </div>
        <div class="order-summary">
          <div class="item-count">1 item</div>
          <div class="order-price">${{ (order.total_amount_cents / 100).toFixed(2) }}</div>
          <span :class="['status-badge', getStatusClass(order.payment_status)]">
            {{ formatStatus(order.payment_status) }}
          </span>
        </div>
      </div>

      <div class="order-footer">
        {{ getStatusMessage(order.payment_status) }}
      </div>
    </div>
  </div>
</template> -->
