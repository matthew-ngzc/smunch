<script>
// import OrderTimeline from '../components/OrderTimeline.vue'
import { defineComponent, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'


// progress timeline
// const data = {
//   steps: [ 'step1', 'step2', 'step3', 'step4'],
//   currentStep: 1,
//   activeColor: rgb(0, 0, 0),
//   passiveColor: white,
// };


export default defineComponent({
  
  setup() {
    const cart = useCartStore()
    const router = useRouter() 

    const total = computed(() => {
      return cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    })

    const next = () => {
      router.push({ name: 'selectLocation' })  // Make sure is a valid route
    }
    return { cart, total, next }
  }
})


</script>

<template>

  <div class="cart-page">

    <!-- <div class="top"> 
      <OrderTimeline :data="data"/>
    </div> -->
    

    <h2 v-if="cart.items.length > 0">Your {{ cart.items[0].merchant_name }} Cart</h2>
    <h2 v-else>Your Cart</h2>

    <div v-if="cart.items.length > 0">
      <div v-for="item in cart.items" :key="item.id" class="cart-item">
        <img :src="item.image_url" alt="item image" class="item-image" />
        <div><strong>{{ item.name }}</strong></div>
        <div>Quantity: {{ item.quantity }}</div>
        <div>Cost: ${{ (item.quantity * item.price).toFixed(2) }}</div>
      </div>

      <hr />
      <h3>Total: ${{ total.toFixed(2) }}</h3>
    </div>

    <div v-else>
      <p>Your cart is empty.</p>
    </div>

    <button class="next-btn" @click="next">next</button>
  </div>
</template>


<style scoped>
.cart-page {
  padding: 20px;
  font-family: 'Inter', sans-serif;
}
.cart-item {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}
.item-image {
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
}
.next-btn {
  display: block;
  margin: 24px auto 0;
  padding: 12px 24px;
  background-color: #007a3d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style> 