<script setup>
import { ref, onMounted } from 'vue'
import { getPastOrders } from '@/services/checkOrdersService'

const pastOrders = ref([])
const userId = '12345'  // need login info -> replace with actual userid when user logs in

onMounted(async () => {
  try {
    const res = await getPastOrders(userId)
    pastOrders.value = res.data
  } catch (error) {
    console.error('Failed to load active orders:', error)
  }
})
</script>

<template>
  <div class="orders-page">
    <h2>Past Orders</h2>
    <ul>
      <li v-for="order in pastOrders" :key="order.id">
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
