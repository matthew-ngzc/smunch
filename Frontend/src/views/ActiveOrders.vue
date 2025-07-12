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
  <div class="orders-page no-scroll">
    <h2>Active Orders</h2>
    <ul>
      <li v-for="order in activeOrders" :key="order.id">
        Order #{{ order.order_id }} – {{ order.payment_status }} – ${{ (order.total_amount_cents / 100).toFixed(2) }} 
      </li>
    </ul>
  </div>
</template>

<style scoped>
.orders-page.no-scroll {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.orders-page.no-scroll h2 {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}
.orders-page.no-scroll ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
