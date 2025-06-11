<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router' 
import { useDeliveryStore } from '@/stores/delivery'
import { useCartStore } from '@/stores/cart'
import ordertimeline from '../components/ordertimeline.vue'

   // progress timeline
    const data = {
      steps: [ 'order details', 'select delivery location', 'order confirmation', 'payment'],
      currentStep: 3,
      activeColor: 'rgb(0, 0, 0)',
      passiveColor: 'grey',
    };



const router = useRouter() 
const delivery = useDeliveryStore()
const cart = useCartStore()

const total = computed(() =>
  cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0) + 1 // Include $1.00 delivery fee
)

const next = () => {
  router.push({ name: 'payment' })
}
</script>

<template>
  <div class="summary-page">

     <ordertimeline :data="data" :routes="routes" />
    
    <!-- Main Summary Box -->
    <div class="summary-box">
      <h2>order summary</h2>

      <div class="summary-section">
        <h4>items</h4>
        <div class="summary-items">
          <div class="item-row header">
            <div>item</div>
            <div>quantity</div>
            <div>price</div>
          </div>
          <div v-for="item in cart.items" :key="item.id" class="item-row">
            <div>{{ item.name }}</div>
            <div>{{ item.quantity }}</div>
            <div>${{ (item.quantity * item.price).toFixed(2) }}</div>
          </div>
        </div>

        <hr />

        <div class="summary-totals">
          <div class="total-row">
            <span>delivery fee</span>
            <span>$1.00</span>
          </div>
          <div class="total-row bold">
            <span>total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="summary-section">
        <h4>delivery details</h4>
        <div class="delivery-details">
          <p><strong>location</strong><br />{{ delivery.building }} {{ delivery.floor }} - {{ delivery.facilityType }}</p>
          <p><strong>date</strong><br />{{ delivery.date }}</p>
          <p><strong>time</strong><br />{{ delivery.time }}</p>
        </div>
      </div>

      <button class="next-btn" @click="next">next</button>
    </div>
  </div>
</template>

<style scoped>
.summary-page {
  font-family: 'Inter', sans-serif;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.steps {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  gap: 32px;
}

.step {
  text-align: center;
  color: #999;
  font-weight: bold;
}
.step.active {
  color: black;
}
.step span {
  font-size: 0.8rem;
}

.summary-box {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
}

.summary-section {
  margin-top: 24px;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-row {
  display: flex;
  justify-content: space-between;
}
.item-row.header {
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
}

.summary-totals {
  margin-top: 16px;
}
.total-row {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
}
.total-row.bold {
  font-weight: bold;
}

.delivery-details p {
  margin-bottom: 12px;
}

.next-btn {
  margin-top: 24px;
  width: 100%;
  padding: 12px;
  background-color: #007a3d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}
</style>
