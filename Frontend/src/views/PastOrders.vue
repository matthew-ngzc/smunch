<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { getPastOrders, getMerchantInfoById } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'
import OrderReceipt from '@/components/OrderReceipt.vue'
import { formatDateTime, formatStatusClass, formatStatus, formatLocation } from '@/utility/orderHelpers'

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
      <div class="info-container">
        <div class="info-icon">
          <img src="/infoIcon.png" alt="Info" class="info-icon-img" />
        </div>
        <div class="tooltip">
                      <div class="info-text">
              <h4>Order Status</h4>
              <div class="status-list">
                <div class="status-item">
                  <span class="dot grey"></span>
                  <span class="status-name">Refund pending</span>
                  <span class="status-desc">Refund for an order has been filed</span>
                </div>
                <div class="status-item">
                  <span class="dot grey"></span>
                  <span class="status-name">Refund completed</span>
                  <span class="status-desc">Refund for an order has processed</span>
                </div>
                <div class="status-item">
                  <span class="dot grey"></span>
                  <span class="status-name">Awaiting payment</span>
                  <span class="status-desc">An order is awaiting payment</span>
                </div>
                <div class="status-item">
                  <span class="dot grey"></span>
                  <span class="status-name">Awaiting verification</span>
                  <span class="status-desc">After user makes payment</span>
                </div>
                <div class="status-item">
                  <span class="dot orange"></span>
                  <span class="status-name">Payment confirmed</span>
                  <span class="status-desc">Payment for an order has processed</span>
                </div>
                <div class="status-item">
                  <span class="dot yellow"></span>
                  <span class="status-name">Preparing</span>
                  <span class="status-desc">Merchant is preparing the order</span>
                </div>
                <div class="status-item">
                  <span class="dot yellow"></span>
                  <span class="status-name">Collected by runner</span>
                  <span class="status-desc">Runner has collected the food</span>
                </div>
                <div class="status-item">
                  <span class="dot green"></span>
                  <span class="status-name">Delivered</span>
                  <span class="status-desc">Food has been delivered by runner</span>
                </div>
                <div class="status-item">
                  <span class="dot green"></span>
                  <span class="status-name">Completed</span>
                  <span class="status-desc">Food has been received by user</span>
                </div>
                <div class="status-item">
                  <span class="dot red"></span>
                  <span class="status-name">Cancelled</span>
                  <span class="status-desc">Users order has been cancelled</span>
                </div>
              </div>
            </div>
        </div>
      </div>
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

/* Info tooltip styles (matching Collections.vue) */
.info-container {
  position: relative;
  z-index: 5;
  cursor: pointer;
}

.info-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.info-icon:hover {
  transform: scale(1.05);
}

.info-icon-img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.tooltip {
  position: absolute;
  top: 45px;
  right: -10px;
  max-width: 320px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  transform: translateY(-5px);
  pointer-events: none;
}

.info-container:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.info-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2f855a;
  line-height: 1.2;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: left;
  letter-spacing: 0.01em;
  position: relative;
  white-space: normal;
  border: 1px solid rgba(102, 126, 234, 0.1);
  backdrop-filter: blur(10px);
  width: 470px;
}

.info-text::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(255, 255, 255, 0.95);
}

.info-text h4 {
  margin: 0 0 0.8rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #134e4a;
  text-align: center;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.2rem 0;
  line-height: 1.3;
}

.status-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  min-width: 140px;
  flex-shrink: 0;
}

.status-desc {
  font-size: 0.8rem;
  color: #666;
  flex: 1;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot.grey { background-color: #555; }
.dot.orange { background-color: #fd7e14; }
.dot.yellow { background-color: #ffc107; }
.dot.green { background-color: #198754; }
.dot.red { background-color: #dc3545; }

/* Mobile responsive styles */
@media (max-width: 768px) {
  .orders-page {
    padding: 15px;
  }
  
  .orders-page h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  .order-card {
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .order-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .merchant-logo {
    width: 80px;
    height: 70px;
    align-self: center;
  }
  
  .order-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .order-summary {
    align-items: flex-start;
    min-width: auto;
  }
  
  .status-badge {
    margin-top: 10px;
    min-width: 100px;
  }
  
  .coin-reward {
    margin-top: 8px;
  }
  
  .empty-state {
    padding: 40px 15px;
    margin: 20px 10px;
  }
  
  .empty-state h3 {
    font-size: 1.3rem;
  }
  
  .empty-state p {
    font-size: 0.9rem;
  }
  
  .info-text {
    width: 90vw;
    max-width: 350px;
  }
  
  .tooltip {
    right: -50px;
  }
  
  .status-name {
    min-width: 100px;
    font-size: 0.8rem;
  }
  
  .status-desc {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .orders-page {
    padding: 10px;
  }
  
  .orders-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .order-card {
    padding: 12px;
  }
  
  .order-header h3 {
    font-size: 1.1rem;
  }
  
  .order-meta p,
  .order-meta small {
    font-size: 0.8rem;
  }
  
  .order-price {
    font-size: 1rem;
  }
  
  .status-badge {
    font-size: 0.7rem;
    padding: 4px 8px;
    min-width: 80px;
  }
  
  .coin-reward {
    margin-top: 6px;
  }
  
  .coin-text {
    font-size: 0.9rem;
  }
  
  .coin-icon-small {
    width: 30px;
    height: 30px;
  }
  
  .pagination {
    bottom: 10px;
    gap: 2px;
  }
  
  .page-btn {
    padding: 4px 8px;
    font-size: 0.8rem;
    min-width: 24px;
    height: 24px;
  }
  
  .info-text {
    width: 85vw;
    max-width: 300px;
    padding: 0.8rem 1rem;
  }
  
  .info-text h4 {
    font-size: 0.9rem;
  }
  
  .status-item {
    gap: 0.5rem;
  }
  
  .status-name {
    min-width: 80px;
    font-size: 0.75rem;
  }
  
  .status-desc {
    font-size: 0.7rem;
  }
}
</style>