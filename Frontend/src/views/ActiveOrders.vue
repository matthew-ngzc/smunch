<script setup>
import { ref, onMounted } from 'vue'
import { getActiveOrders } from '@/services/orderFoodService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const activeOrders = ref([])
// const userId = '12345' // shayln: need login info -> replace with actual userid when user logs in

onMounted(async () => {
  const userId = authStore.userId // reiwen: dynamically give the userId 

  try {
    const res = await getActiveOrders(userId)
    activeOrders.value = res.data.orders
  } catch (error) {
    console.error('Failed to load active orders:', error)
  }
})
</script>

<template>
  <div class="orders-page">
    <h2>Active Orders</h2>
    <ul>
      <li v-for="order in activeOrders" :key="order.id">
        Order #{{ order.order_id }} – {{ order.payment_status }} – ${{ (order.total_amount_cents / 100).toFixed(2) }} 
      </li>
    </ul>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 20px;
}

.orders-page ul {
  list-style: none;
  padding: 0;
}
</style>
