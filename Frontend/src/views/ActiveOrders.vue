<script setup>
import { ref, onMounted } from 'vue'
import { getActiveOrders, getMerchantInfoById } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const activeOrders = ref([])
const merchantMap = ref({}) 
// const userId = '12345' // shayln: need login info -> replace with actual userid when user logs in

onMounted(async () => {
  const userId = authStore.userId

  try {
    const res = await getActiveOrders(userId)
    activeOrders.value = res.data.orders

    // get unique merchant_ids
    const uniqueMerchantIds = [...new Set(res.data.orders.map(order => order.merchant_id))]

    // fetch merchant info for each ID
    await Promise.all(uniqueMerchantIds.map(async (id) => {
      try {
        const merchantRes = await getMerchantInfoById(id)
        merchantMap.value[id] = merchantRes.data.merchant
      } catch (err) {
        console.error(`Failed to load merchant ${id}:`, err)
      }
    }))
  } catch (error) {
    console.error('Failed to load active orders:', error)
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
    minute: '2-digit'
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
  <div class="orders-page no-scroll">
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
  margin-top: 6px;
  font-weight: 600;
}

.status-grey {
  background-color: #444;
  color: white;
}

.status-green {
  background-color: green;
  color: white;
}

.status-yellow {
  background-color: gold;
  color: black;
}

.order-footer {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #666;
}
</style>
