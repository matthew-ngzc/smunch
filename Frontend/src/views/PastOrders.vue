<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPastOrders, getMerchantInfoById } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'
import OrderReceipt from '@/components/OrderReceipt.vue'
import { formatDateTime, formatStatusBadge } from '@/utility/orderHelpers'

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

function getOrderStatusBadge(order) {
  if (order.order_status === 'completed') {
    return { text: 'Completed', class: 'status-green' }
  } else if (order.order_status === 'cancelled') {
    return { text: 'Cancelled', class: 'status-red' }
  } else {
    return { text: order.order_status, class: 'status-grey' }
  }
}
</script>

<template>
  <div class="orders-page">
    <h2>Order History</h2>
    <ul class="orders-list">
      <li v-for="order in pastOrders" :key="order.order_id" class="order-card" @click="openReceipt(order)" style="cursor: pointer">
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
            <p>{{ order.merchant.name }}</p>
            <p class="pickup-time">Pick up time: {{ formatDateTime(order.delivery_time) }}</p>
          </div>

          <div class="order-footer">
            <span class="status-badge" :class="getOrderStatusBadge(order).class">
              {{ getOrderStatusBadge(order).text }}
            </span>
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
    <OrderReceipt v-if="selectedOrder" :order="selectedOrder" :onClose="closeReceipt" :showOrderStatus="true" />
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
  justify-content: flex-end;
  align-items: center;
  margin-top: 12px;
}

.status-badge {
  padding: 4px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
}

.status-green {
  background-color: #198754;
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
