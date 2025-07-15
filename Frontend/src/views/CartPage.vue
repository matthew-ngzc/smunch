<script>

import { defineComponent, computed, ref } from 'vue'
// to keep data in cart 
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
// initalise qty of items incart
import { onMounted } from 'vue'
// importing the timeline
import ordertimeline from '../components/ordertimeline.vue'


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

    // have to also return data for progress timeline!
    return { cart, total, next, data, routes, quantities, increase, decrease, hasItemsInCart, showEmptyCartWarning }
  }
})


</script>

<template>

  <div class="cart-page">

    <!-- pass both data and routes -->
     <ordertimeline :data="data" :routes="routes" />

    <div class="cart"> 

    <h2>Your Cart</h2>

    <hr class="divider" />

    <!-- starts a block that ONLY shows if the cart is not empty -->
    <div class="cart-content" v-if="cart.items.length > 0">
      <!-- loops through every item in cart.items, creates div for each item  --> <!-- :key="item.id" is needed to track items  -->
      <div v-for="item in cart.items" :key="item.id" class="cart-item">

        <!-- item image -->
        <img :src="item.image_url" alt="item image" class="item-image" />
        <div class="item-row"> 
            <!-- item name -->
          <div class="item-name"><strong>{{ item.name }}</strong></div>
          <div class="item-right">  
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

      

      <div v-else>
        <p>Your cart is empty.</p>
      </div>

      <div class="bottom"> 
        
        <hr class="divider" />

        <div class="cost-wrapper"> 
          <!--  total cost of items in cart, from script using computed -->
          <h3 class="total-cost">Total (Excl. delivery fee): </h3>
          <h3 class="cost"> ${{ total.toFixed(2) }} </h3>
        </div>

        <div v-if="showEmptyCartWarning" class="warning-banner">
          Your cart is empty. Please select at least one item before proceeding.
        </div>
        <div class="wrapper"> 
          <button class="next" @click="next">next</button>
        </div>

      </div>


    
    
  </div>
  </div>
</template>


<style scoped>

.cart {
  background-color: white;
  margin-top: 30px;
  border-radius: 50px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  /* make box appear bigger than its contents */
  padding: 40px;           /* adds space inside the box */
  min-height: 700px;       /* regardless of # of items in cart, box has to occupy entire height */
  width: 100%;             /* stretches full width of parent */

  display: flex;
  flex-direction: column;
}

.cart h2 {
  margin-top: 10px;
  margin-bottom: 20px;
  font-weight: bold;
}

/* take up all the remaining vertical space in container cart, but let anything after sit at the bottom */
.cart-content {
  flex-grow: 1;
}


.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 12px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

/* name + right side in a row */
.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 16px;
}

/* name will stretch */
.item-name {
  flex: 1;
  font-size: 20px;
}

/* right side wrapper */
.item-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

/* button group */
.menu-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  margin-right: 30px;
}

.menu-controls button {
  background-color: #30895f;
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-controls span {
  display: inline-block;
  width: 2.5ch;
  text-align: center;
  flex: 0 0 auto;
}

.item-cost {
  font-weight: 600;
  min-width: 60px;
  text-align: right;
  flex-shrink: 0;
  font-size: 20px;
  /* to prevent the RHS cost from shifting the menu control */
  display: inline-block;
  width: 2.5ch;
  margin-right: 20px;
}

.cost-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  
}

.bottom {
  margin-top: auto;
}

.divider {
  border: none;
  height: 1px;
  background-color: #5c5959; /* very light grey */
  margin-top:-2px;
}


.total-cost {
  font-size: 20px;
   display: inline-block;
}

.cost {
  display: inline-block;
  text-align: right;
  font-size: 21px;
  margin-right: 25px;
  font-weight: bold;
}

.wrapper {
  display: flex;
  justify-content: center;
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

.next-btn:hover {
   background-color: #036232;
}

.warning-banner {
  background-color: #ffe6e6;
  color: #b30000;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 500;
  border: 1px solid #ffb3b3;
}

</style> 