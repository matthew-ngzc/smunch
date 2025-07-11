<script setup>
import { ref, onMounted } from 'vue'
import { getActiveOrders } from '@/services/orderFoodService'

const activeOrders = ref([])
const userId = '12345' // need login info -> replace with actual userid when user logs in

onMounted(async () => {
  try {
    const res = await getActiveOrders(userId)
    activeOrders.value = res.data
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
        {{ order.details }}
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
