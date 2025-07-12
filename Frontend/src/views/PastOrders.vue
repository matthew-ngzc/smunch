<script setup>
import { ref, onMounted } from 'vue'
import { getPastOrders } from '@/services/orderFoodService'

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
  <div class="orders-page no-scroll">
    <h2>Past Orders</h2>
    <ul>
      <li v-for="order in pastOrders" :key="order.id">
        {{ order.details }}
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
