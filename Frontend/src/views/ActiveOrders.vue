<script setup>
import { ref, onMounted, watch } from 'vue'
import { getActiveOrders, getMerchantInfoById } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'
import OrderReceipt from '@/components/OrderReceipt.vue'
import { formatDateTime, formatStatusClass, formatStatus } from '@/utility/orderHelpers'

const authStore = useAuthStore()
const activeOrders = ref([])
const selectedOrder = ref(null)
const currentPage = ref(1)
const pageSize = 5
const totalOrders = ref(0)

async function fetchActiveOrders(page = 1) {
  const userId = authStore.userId
  const offset = (page - 1) * pageSize
  try {
    const res = await getActiveOrders(userId, pageSize, offset)
    const orders = res.data.orders
    totalOrders.value = res.data.total || 0
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
}

onMounted(() => {
  fetchActiveOrders(1)
})

function changePage(page) {
  currentPage.value = page
  fetchActiveOrders(page)
}

function getItemCount(order) {
  if (!order.order_items || !Array.isArray(order.order_items)) return 0
  return order.order_items.reduce((sum, item) => sum + (item.quantity || 1), 0)
}

function openReceipt(order) {
  selectedOrder.value = order
}
function closeReceipt() {
  selectedOrder.value = null
}

function getStatusMessage(status) {
  switch (status) {
    case 'awaiting_payment': return 'Payment not made.'
    case 'payment_confirmed': return 'Payment confirmed. We will deliver your order to you.'
    case 'awaiting_verification': return 'Order confirmed. Smunch will confirm your payment asap.'
    default: return ''
  }
}

watch(selectedOrder, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : 'auto'
})
</script>

<template>
  <div class="orders-page">
    <h2>Active orders</h2>
    <ul class="orders-list">
      <li v-for="order in activeOrders" :key="order.order_id" class="order-card" @click="openReceipt(order)">
        <div class="order-content">
          <img :src="order.merchant.image_url" alt="merchant logo" class="merchant-logo" />
          <div class="order-main">
            <div class="order-header">
              <div>
                <h3>Order {{ order.order_id }}</h3>
                <p>Destination: {{ order.building.toUpperCase() }}, {{ order.room_type }} {{ order.room_number }}</p>
                <p>Merchant: {{ order.merchant.name }}</p>
                <p>Deliver date and time: {{ formatDateTime(order.delivery_time) }}</p>
                <small>Order placed on {{ formatDateTime(order.created_at) }}</small>
              </div>
              <div class="order-summary">
                <div>{{ getItemCount(order) }} item<span v-if="getItemCount(order) > 1">s</span></div>
                <div class="order-price">${{ (order.total_amount_cents / 100).toFixed(2) }}</div>
                <span class="status-badge" :class="formatStatusClass(order.payment_status)">
                  {{ formatStatus(order.payment_status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="pagination">
      <button
        v-for="page in Math.ceil(totalOrders / pageSize)"
        :key="page"
        :class="['page-btn', { active: page === currentPage } ]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>
    <OrderReceipt v-if="selectedOrder" :order="selectedOrder" :onClose="closeReceipt" />
  </div>
</template>

<style scoped>
.orders-page {
  padding: 20px;
}

.orders-page h2 {
  font-weight: bold;
  margin-top: 20px;
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
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
  cursor: pointer;
}

.order-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.merchant-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.order-main {
  flex: 1;
}

.order-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.order-summary {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.order-price {
  font-size: 18px;
  font-weight: bold;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-align: center;
  min-width: 120px;
}

.status-green {
  background-color: green;
}

.status-grey {
  background-color: #555;
}

.status-yellow {
  background-color: gold;
  color: black;
}

.pagination {
  display: flex;
  gap: 8px;
  margin-top: 24px;
  justify-content: center;
}
.page-btn {
  background: #eee;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.page-btn.active, .page-btn:hover {
  background: #17614a;
  color: #fff;
}
</style>
