<script setup>
import { ref, onMounted, watch, computed } from 'vue'
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

  // currently logged in userid
  const userId = authStore.userId
  // calculates how many orders to skip in pagination
  const offset = (page - 1) * pageSize

  try {
    // makes the actual request to your backend
    const res = await getActiveOrders(userId, pageSize, offset)
    // pulls out the list of orders and total order count from the response
    const orders = res.data.orders
    totalOrders.value = res.data.total || 0

    // for every order, you make a separate call to fetch its merchant info
    const ordersWithMerchant = await Promise.all(
      orders.map(async (order) => {
        const merchantRes = await getMerchantInfoById(order.merchant_id)
        order.merchant = merchantRes.data
        return order
      })
    )
    // store everything in reactive variable created earlier
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

const totalPages = computed(() => Math.ceil(totalOrders.value / pageSize))
const paginationRange = computed(() => {
  // Always show all page numbers for < 1 2 3 4 5 >
  return totalPages.value > 1 ? Array.from({ length: totalPages.value }, (_, i) => i + 1) : []
})
function prevPage() {
  if (currentPage.value > 1) changePage(currentPage.value - 1)
}
function nextPage() {
  if (currentPage.value < totalPages.value) changePage(currentPage.value + 1)
}
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
            <div class="order-text">
              <h3>Order {{ order.order_id }}</h3>
              <div class="order-meta">
                <p>Destination: School of {{ order.building.charAt(0).toUpperCase() + order.building.slice(1) }},  {{ order.room_number.charAt(0).toUpperCase() + order.room_number.slice(1) }} {{ order.room_type.charAt(0).toUpperCase() + order.room_type.slice(1) }}</p>
                <p>Merchant: {{ order.merchant.name }}</p>
                <p>Delivery date & time: {{ formatDateTime(order.delivery_time) }}</p>
                <small>Order placed on {{ formatDateTime(order.created_at) }}</small>
              </div>
            </div>

            <div class="order-summary">
              <div class="top-summary">
                <span>{{ getItemCount(order) }} item<span v-if="getItemCount(order) > 1">s</span></span>
                <div class="order-price">${{ (order.total_amount_cents / 100).toFixed(2) }}</div>
              </div>
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
      <button class="page-btn nav-btn" :disabled="currentPage === 1" @click="prevPage">&#60;</button>
      <button
        v-for="page in paginationRange"
        :key="page"
        :class="['page-btn', { active: page === currentPage } ]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button class="page-btn nav-btn" :disabled="currentPage === totalPages" @click="nextPage">&#62;</button>
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
  box-shadow: 0 0 10px rgb(175, 172, 172);
}

.order-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.merchant-logo {
  width: 110px;
  height: 100px;
  object-fit: contain;
}

.order-main {
  flex: 1;
}

.order-header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.order-text {
  flex: 1;
}

.order-header h3 {
  font-weight: bold;
  font-size: 23px;
  margin-bottom: 6px;
}

.order-meta p,
.order-meta small {
  margin: 2px 0;
  font-size: 14px;
  line-height: 1.2;
}

.order-meta small {
  margin-top: 16px;
  display: block;
  color: grey;
  font-size: 12px;
}

.order-summary {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  min-width: 120px;
  height: 100%;
}

.top-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.order-price {
  font-size: 18px;
  font-weight: bold;
  margin-top: 2px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-align: center;
  min-width: 120px;
  margin-top: 36px;
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
  align-items: center;
}
.page-btn {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  cursor: pointer;
  transition: border 0.2s, color 0.2s, background 0.2s;
}
.page-btn.active {
  border: 2px solid #6c3cff;
  color: #6c3cff;
  background: #fff;
}
.page-btn[disabled] {
  cursor: default;
  color: #bbb;
  background: #f3f3f3;
  border: 2px solid #e0e0e0;
}
.page-btn.nav-btn {
  font-size: 1.5rem;
  padding: 8px 16px;
  color: #bbb;
  background: #f3f3f3;
  border: 2px solid #e0e0e0;
}
.page-btn.nav-btn:not([disabled]) {
  color: #222;
  background: #fff;
}
</style>
