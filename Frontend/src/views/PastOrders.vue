<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { getPastOrders, getMerchantInfoById } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'
import OrderReceipt from '@/components/OrderReceipt.vue'
import { formatDateTime, formatStatusClass, formatStatus, formatLocation } from '@/utility/orderHelpers'
import InfoPopup from '@/components/InfoPopup.vue'
import coins from '@/assets/smunch_coin.jpg';

const authStore = useAuthStore()
const pastOrders = ref([])
const selectedOrder = ref(null)
const currentPage = ref(1)
const pageSize = 5
const totalOrders = ref(0)

async function fetchPastOrders(page = 1) {
  const userId = authStore.userId
  const offset = (page - 1) * pageSize
  try {
    const res = await getPastOrders(userId, pageSize, offset)
    const orders = res.data.orders
    totalOrders.value = res.data.total || 0
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
}

onMounted(() => {
  fetchPastOrders(1)
})

function changePage(page) {
  currentPage.value = page
  fetchPastOrders(page)
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

watch(selectedOrder, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : 'auto'
})

function getCombinedStatus(order) {
  if (order.payment_status === 'awaiting_payment') return 'awaiting_payment'
  if (order.payment_status === 'awaiting_verification') return 'awaiting_verification'
  if (order.payment_status === 'payment_confirmed') {
    if (order.order_status === 'preparing') return 'preparing'
    if (order.order_status === 'collected') return 'collected_by_runner'
    if (order.order_status === 'delivered') return 'delivered'
    if (order.order_status === 'completed') return 'completed'
    return 'payment_confirmed' // fallback
  }
  return 'awaiting_payment' // fallback
}

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
  <div class="orders-page-wrapper">
  <div class="orders-page">
    <div class="orders-header">
      <h2>Order History</h2>
      <InfoPopup />
    </div>

    <ul class="orders-list">
      <li
        v-for="order in pastOrders" :key="order.order_id" class="order-card" @click="openReceipt(order)" style="cursor: pointer" >
        <div class="order-content">
          <img :src="order.merchant.image_url" alt="merchant logo" class="merchant-logo" />

          <div class="order-main">
            <div class="order-header">
              <div class="order-text">
                <h3>Order {{ order.order_id }}</h3>
                <div class="order-meta">
                  <p>Merchant: {{ order.merchant.name }}</p>
                  <p>Delivery date & time: School of {{ formatLocation(order) }}</p>
                  <small>Order placed on {{ formatDateTime(order.created_at) }}</small>
                </div>
              </div>

              <div class="order-summary">
                <div class="top-summary">
                  <span>{{ getItemCount(order) }} item<span v-if="getItemCount(order) > 1">s</span></span>
                  <div class="order-price">${{ (order.total_amount_cents / 100).toFixed(2) }}</div>
                  <!-- Coin reward for completed orders -->
                  <div v-if="order.order_status === 'completed'" class="coin-reward">
                    <span class="coin-text">+1</span>
                    <img src="../assets/smunch_coin.jpg" alt="Smunch Coin" class="coin-icon-small" />
                  </div>
                </div>
                <span class="status-badge" :class="formatStatusClass(getCombinedStatus(order))">
                  {{ formatStatus(getCombinedStatus(order)) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Empty state for no orders -->
    <div v-if="pastOrders.length === 0" class="empty-state">
      <h3>No Order History</h3>
      <p>You haven't placed any orders yet. Start ordering to see your history here!</p>
      <router-link to="/order" class="empty-action-btn">Start Ordering</router-link>
    </div>

    <!-- Pagination - only show if there are orders -->
    <div v-if="pastOrders.length > 0" class="pagination">
      <button class="page-btn nav-btn" :disabled="currentPage === 1" @click="prevPage">&#60;</button>
      <button
        v-for="page in paginationRange"
        :key="page"
        :class="['page-btn', { active: page === currentPage }]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button class="page-btn nav-btn" :disabled="currentPage === totalPages" @click="nextPage">&#62;</button>
    </div>

    <OrderReceipt v-if="selectedOrder" :order="selectedOrder" :onClose="closeReceipt" :showOrderStatus="true" />
    </div>
  </div>
</template>

<style scoped>
.orders-page-wrapper {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
}

.orders-page {
  padding: 20px;
  width: 100%;
  max-width: 1200px;
}

.orders-page h2 {
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 30px;
  display: inline-block;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border: none;
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
  margin-top: 39px;
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

/* Coin reward styling */
.coin-reward {
  display: flex;
  align-items: center;
  gap: 0px;
  margin-top: 4px;
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
  background-color: #198754;
}

.status-red {
  background-color: #dc3545;
}

.status-grey {
  background-color: #555;
}

.status-orange {
  background-color: #fd7e14;
}

.status-yellow {
  background-color: #ffc107;
  color: black;
}

/* Empty state styling */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  margin-top: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  margin-left: 20px;
  margin-right: 20px;
  max-height: 400px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-action-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007a3d;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.empty-action-btn:hover {
  background-color: #036232;
}

/* Pagination styling - smaller and at bottom */
.pagination {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.page-btn {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn.active {
  border: 1px solid #6c3cff;
  color: #6c3cff;
  background: #fff;
  font-weight: 600;
}

.page-btn[disabled] {
  cursor: default;
  color: #bbb;
  background: #f3f3f3;
  border: 1px solid #e0e0e0;
}

.page-btn.nav-btn {
  font-size: 16px;
  padding: 6px 10px;
  color: #bbb;
  background: #f3f3f3;
  border: 1px solid #e0e0e0;
}

.page-btn.nav-btn:not([disabled]) {
  color: #222;
  background: #fff;
}
</style>