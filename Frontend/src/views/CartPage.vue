<script>

import { defineComponent, computed, ref } from 'vue'
// to keep data in cart 
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
// initalise qty of items incart
import { onMounted } from 'vue'
// importing the timeline
import ordertimeline from '../components/OrderTimeline.vue'


export default defineComponent({

  components: { ordertimeline },
  
  setup() {
    const cart = useCartStore()
    const router = useRouter()
    const quantities = ref({})
    const showEmptyCartWarning = ref(false)

    const hasItemsInCart = computed(() =>
      cart.items.some(item => item.quantity > 0)
    )



    const increase = (id) => {
      quantities.value[id] = (quantities.value[id] || 0) + 1

    const item = cart.items.find(i => i.id === id)
    if (item) item.quantity = quantities.value[id]
  }

  const decrease = (id) => {
    if (quantities.value[id] > 0) {
      quantities.value[id]--

      const item = cart.items.find(i => i.id === id)
      if (item) item.quantity = quantities.value[id]
    }
  }

    // progress timeline
    const data = {
      steps: [ 'order details', 'delivery location', 'order confirmation', 'payment'],
      currentStep: 1,
      activeColor: 'rgb(0, 0, 0)',
      passiveColor: 'grey',
    };

    // using data from previous page 
    onMounted(() => {
      cart.items.forEach(item => {
        quantities.value[item.id] = item.quantity
      })
    })



    // for routing buttons --- soon!!
    // routes array must line up with data.steps
    const routes = [
     { name: 'cartPage' },
     { name: 'selectLocation' },
     { name: 'orderSummary' },
     { name: 'payment' }
   ]

   // calculates total price of items in cart 
    const total = computed(() => {
      return cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    })


    // button next clicked, go to the next page
    const next = () => {
      if (!hasItemsInCart.value) {
        showEmptyCartWarning.value = true
        return
      }
      router.push({ name: 'selectLocation' })  
    }

    // back button functionality
    const goBack = () => {
      router.go(-1)
    }

    // have to also return data for progress timeline!
    return { cart, total, next, goBack, data, routes, quantities, increase, decrease, hasItemsInCart, showEmptyCartWarning }
  }
})


</script>

<template>

  <div class="cart-page-wrapper">
  <div class="cart-page">

    <!-- pass both data and routes -->
     <ordertimeline :data="data" :routes="routes" />

      <div class="cart-container">

        <div class="back-button" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="cart-header">
          <div class="header-accent"></div>
    <h2>Your Cart</h2>
          <p class="header-subtitle">Review your order items</p>
        </div>

        <div class="cart-content">
    <!-- starts a block that ONLY shows if the cart is not empty -->
          <div v-if="cart.items.length > 0" class="cart-items">
      <!-- loops through every item in cart.items, creates div for each item  --> <!-- :key="item.id" is needed to track items  -->
      <div v-for="item in cart.items" :key="item.id" class="cart-item">

        <!-- item image -->
        <img :src="item.image_url" alt="item image" class="item-image" />
              <div class="item-details"> 
            <!-- item name -->
                <div class="item-name">{{ item.name }}</div>
                <div class="item-controls">  
              <div class="menu-controls">
                <button @click="decrease(item.id)">-</button>
                <span>{{ quantities[item.id] }}</span>
                <button @click="increase(item.id)">+</button>
             </div> 

               <!-- total cost of a particular item , toFixed(2)ensures it always shows 2 decimal places-->
            <div class="item-cost">${{ (item.quantity * item.price).toFixed(2) }}</div> 
          </div>
        </div>
      </div>
      </div>

          <div v-else class="empty-cart">
        <p>Your cart is empty.</p>
      </div>

          <div class="cart-summary"> 
        
        <hr class="divider" />

        <div class="cost-wrapper"> 
          <!--  total cost of items in cart, from script using computed -->
          <h3 class="total-cost">Total (Excl. delivery fee): </h3>
          <h3 class="cost"> ${{ total.toFixed(2) }} </h3>
        </div>

        <div v-if="showEmptyCartWarning" class="warning-banner">
          Your cart is empty. Please select at least one item before proceeding.
        </div>
          </div>
        </div>

        <div class="wrapper"> 
          <button class="next" @click="next">next</button>
        </div>
      </div>
  </div>
  </div>
</template>

<style scoped>
.cart-page-wrapper {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 20px 0;
}

.cart-page {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.cart-container {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s ease;
  z-index: 10;
}

.back-button:hover {
  background: #f7fafc;
  border-color: #38c172;
  color: #38c172;
  transform: scale(1.05);
}

.cart-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.header-accent {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #38c172, #2f855a);
  margin: 0 auto 20px;
  border-radius: 2px;
}

.cart-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
  font-weight: 400;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.cart-item:hover {
  background: #f1f3f4;
  border-color: #38c172;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 16px;
}

.item-name {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.menu-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
}

.menu-controls button {
  background-color: #38c172;
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-weight: bold;
}

.menu-controls button:hover {
  background-color: #2f855a;
  transform: scale(1.05);
}

.menu-controls span {
  display: inline-block;
  width: 2.5ch;
  text-align: center;
  flex: 0 0 auto;
  font-weight: 600;
  color: #2d3748;
}

.item-cost {
  font-weight: 600;
  min-width: 60px;
  text-align: right;
  flex-shrink: 0;
  font-size: 1.1rem;
  color: #2d3748;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
  font-size: 1.1rem;
}

.cart-summary {
  margin-top: 8px;
}

.divider {
  border: none;
  height: 1px;
  background-color: #e2e8f0;
  margin: 16px 0;
}

.cost-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  padding: 16px 0;
}

.total-cost {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.cost {
  font-size: 1.2rem;
  font-weight: 700;
  color: #38c172;
}

.warning-banner {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border: 1px solid #feb2b2;
  border-radius: 10px;
  padding: 16px;
  margin: 16px 0;
  animation: slideIn 0.3s ease-out;
}

.warning-banner {
  color: #c53030;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}

.wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.next {
  display: block;
  margin: 24px auto 0;
  padding: 12px 24px;
  background-color: #007a3d;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

.next:hover {
   background-color: #036232;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .cart-page {
    padding: 16px;
  }
  
  .cart-container {
    padding: 24px;
    margin: 10px;
  }
  
  .cart-header h2 {
    font-size: 1.6rem;
  }
  
  .cart-items {
    max-height: 300px;
  }
  
  .item-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .item-controls {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .cart-container {
    padding: 20px;
  }
  
  .cart-header h2 {
    font-size: 1.4rem;
  }
  
  .cart-item {
    padding: 12px;
  }
  
  .item-image {
    width: 50px;
    height: 50px;
  }
  
  .item-name {
    font-size: 1rem;
}
}
</style> 