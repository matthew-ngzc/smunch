<script setup>
import { ref, onMounted } from 'vue'
import { getPastOrders, getMerchantInfoById } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const pastOrders = ref([])

onMounted(async () => {
  const userId = authStore.userId
  try {
    const res = await getPastOrders(userId)
    const orders = res.data.orders

    const ordersWithMerchant = await Promise.all(
      orders.map(async (order) => {
        const merchantRes = await getMerchantInfoById(order.merchant_id)
        order.merchant = merchantRes.data
        return order
      })
    )

    pastOrders.value = ordersWithMerchant
  } catch (error) {
    console.error('Failed to load past orders:', error)
  }
})

function getItemCount(order) {
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

function formatStatusBadge(status) {
  switch (status) {
    case 'completed':
      return { text: 'Completed', class: 'status-green', msg: 'Order successfully delivered.' }
    case 'cancelled':
      return { text: 'Cancelled', class: 'status-red', msg: 'You cancelled this order.' }
    default:
      return { text: status, class: 'status-grey', msg: 'Status unknown.' }
  }
}
</script>

<template>
  <div class="orders-page">
    <h2>Order History</h2>
    <ul class="orders-list">
      <li v-for="order in pastOrders" :key="order.order_id" class="order-card">
        <img :src="order.merchant.image_url" alt="merchant logo" class="merchant-logo" />

        <div class="order-info">
          <div class="order-header">
            <h3>Order #{{ order.order_id }}</h3>
            <div class="order-price-section">
              <span>{{ getItemCount(order) }} item<span v-if="getItemCount(order) > 1">s</span></span>
              <span class="order-price">${{ (order.total_amount_cents / 100).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-details">
            <p>{{ order.pickup_location }}</p>
            <p>{{ order.merchant.name }}</p>
            <p class="pickup-time">Pick up time: {{ formatDateTime(order.delivery_time) }}</p>
          </div>

          <div class="order-footer">
            <p class="status-msg">{{ formatStatusBadge(order.order_status).msg }}</p>
            <span class="status-badge" :class="formatStatusBadge(order.order_status).class">
              {{ formatStatusBadge(order.order_status).text }}
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
}

.orders-page h2 {
  font-weight: bold;
  margin-bottom: 30px;
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

.status-msg {
  font-size: 14px;
  color: #333;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
}

.status-green {
  background-color: green;
  color: white;
}

.status-red {
  background-color: #d63a00;
  color: white;
}

.status-grey {
  background-color: #777;
  color: white;
}
</style>
