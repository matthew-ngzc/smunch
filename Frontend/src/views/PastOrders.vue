<script setup>
import { ref, onMounted } from 'vue'
import { getPastOrders, getMerchantInfoById } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const pastOrders = ref([])
const merchantMap = ref({})

onMounted(async () => {
  const userId = authStore.userId

  try {
    const res = await getPastOrders(userId)
    pastOrders.value = res.data.orders

    const uniqueMerchantIds = [...new Set(pastOrders.value.map(order => order.merchant_id))]

    await Promise.all(uniqueMerchantIds.map(async (id) => {
      try {
        const merchantRes = await getMerchantInfoById(id)
        merchantMap.value[id] = merchantRes.data.merchant
      } catch (err) {
        console.error(`Failed to load merchant ${id}:`, err)
      }
    }))
  } catch (error) {
    console.error('Failed to load past orders:', error)
  }
})

function getMerchantName(merchantId) {
  return merchantMap.value[merchantId]?.name || 'Merchant'
}

function getMerchantLogo(merchantId) {
  return merchantMap.value[merchantId]?.image_url || '/default-logo.png'
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
  <div class="orders-page no-scroll">
    <h2>Order History</h2>

    <div class="order-card" v-for="order in pastOrders" :key="order.order_id">
      <div class="order-header">
        <img :src="getMerchantLogo(order.merchant_id)" alt="Merchant Logo" class="merchant-logo" />
        <div class="order-info">
          <div class="order-id">Order {{ order.order_id }}</div>
          <div class="location">{{ formatLocation(order) }}</div>
          <div class="merchant-name">{{ getMerchantName(order.merchant_id) }}</div>
          <div class="pickup-time">Pick up time: {{ formatDateTime(order.delivery_time) }}</div>
        </div>
        <div class="order-summary">
          <div class="item-count">{{ order.item_count || 1 }} item{{ (order.item_count || 1) > 1 ? 's' : '' }}</div>
          <div class="order-price">${{ (order.total_amount_cents / 100).toFixed(2) }}</div>
        </div>
      </div>

      <div class="order-footer">
        <span>{{ formatStatusBadge(order.order_status).msg }}</span>
        <span :class="['status-badge', formatStatusBadge(order.order_status).class]">
          {{ formatStatusBadge(order.order_status).text }}
        </span>
      </div>
    </div>
  </div>
</template>


<style scoped>
.orders-page.no-scroll {
  padding: 2rem;
}

.order-card {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  background-color: #fff;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.merchant-logo {
  height: 60px;
  margin-right: 1rem;
}

.order-info {
  flex-grow: 1;
}

.order-id {
  font-weight: bold;
  font-size: 1.2rem;
}

.location,
.merchant-name,
.pickup-time {
  font-size: 0.95rem;
}

.order-summary {
  text-align: right;
}

.item-count,
.order-price {
  font-size: 0.95rem;
  font-weight: bold;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  display: inline-block;
  margin-left: 1rem;
  font-weight: 600;
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

.order-footer {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
