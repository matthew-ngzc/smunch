<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router' 
import { useDeliveryStore } from '@/stores/delivery'
import { useCartStore } from '@/stores/cart'
import ordertimeline from '../components/ordertimeline.vue'

   // progress timeline
    const data = {
      steps: [ 'order details', 'delivery location', 'order confirmation', 'payment'],
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
    
    <!-- box -->
    <div class="summary-box">

      <h2>order summary</h2>

      <!-- content inside box -->
      <div class="summary-contents">

        <div class="summary-items">
          <div class="item-row header">
            <div>item</div> 
            <div class="right">
              <div>quantity</div> 
              <div>price</div>
            </div>
            
          </div>
          <!--  loop through each item in cart and present info -->
          <div v-for="item in cart.items" :key="item.id" class="item-row">
            <div class="name">{{ item.name }}</div>
            <div class="right-text"> 
              <div class="qty">{{ item.quantity }}</div>
              <div class="price">${{ (item.quantity * item.price).toFixed(2) }}</div>
            </div>
            
          </div>
        </div>

        

        <div class="summary-totals">
          <div class="total-row">
            <span>Delivery fee</span>
            <span>$1.00</span>
          </div>
          <div class="total-row bold">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
            
          </div>
           <hr />
        </div>

      </div>

      

      <div class="summary-section">
        <h2>delivery details</h2>

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

.summary-box {
  max-width: none !important;
  width: 100%;
}

.summary-box h2 {
  font-size: 30px;
}


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

.summary-contents {
  margin-top: 24px;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 18px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  
}

.item-row.header {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  font-size: 25px;
  font-weight: bold;
  
}

.right {
  display: flex;
  gap: 30px; /* space between quantity and price */
}


.right-text {
  display: flex;
  gap: 30px; /* space between quantity and price */
}

.qty {
   /* to prevent the RHS cost from shifting the menu control */
  display: inline-block;
  width: 5ch;
}


.price {
   /* to prevent the RHS cost from shifting the menu control */
  display: inline-block;
  width: 5ch;
}


.summary-totals {
  margin-top: 70px;
  margin-bottom: 50px;
   font-size: 18px;
}

.summary-section h2 {
  font-size: 30px;
  margin-bottom: 30px;
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
   font-size: 19px;
}
.next-btn {
  display: block;
  margin: 24px auto 0;
  padding: 12px 24px;
  background-color: #007a3d;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
}

.next-btn:hover {
   background-color: #036232;
}
</style>
