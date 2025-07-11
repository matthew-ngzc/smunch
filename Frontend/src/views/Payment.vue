<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import qrCode from '@/assets/qrcode.jpg' 
import { useRouter } from 'vue-router' 
// importing the timeline
import ordertimeline from '../components/ordertimeline.vue'


// progress timeline
  const data = {
    steps: [ 'order details', 'delivery location', 'order confirmation', 'payment'],
    currentStep: 4,
    activeColor: 'rgb(0, 0, 0)',
    passiveColor: 'grey',
  };


const router = useRouter() 
const cart = useCartStore()
const total = computed(() =>
  cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0) + 1 // +$1 delivery
)

const done = () => {
  router.push({ name: 'Home' })
}

</script>

<template>
  <div class="payment-page">
     <!-- pass both data and routes -->
    <ordertimeline :data="data" :routes="routes" />
  
  <div class="payment-container">

    <h2 class="title">Follow the steps below to proceed with payment.</h2><br />

    <div class="content">
      <!-- Steps -->
      <div class="steps">
        <p><strong>STEP 1:</strong><br />
        Scan the PayNow QR to pay <strong>${{ total.toFixed(2) }}</strong>.<br />
        Add transaction no. in PayNow notes: <strong>01234567</strong>.</p><br />

        <p><strong>STEP 2:</strong><br />
        Send your payment screenshot to <strong>@smunchAdmin</strong> via telegram.</p><br />

        <p><strong>STEP 3:</strong><br />
        Press “done” once payment has been made!</p><br />
      </div>

      <!-- QR Code -->
      <div class="qr-box">
        <img :src="qrCode" alt="PayNow QR Code" class="qr-image" />
        <p class="qr-caption">Paynow recipient’s name: <strong>Smunch</strong></p>
      </div>
    </div>

    <p class="note">
      You will receive a confirmation from Smunch Admin within 1–2 days.
    </p>

    <button class="done-btn" @click="done">done</button>
  </div>
  </div>
</template>

<style scoped>
.payment-container {
  max-width: 1500px;
  width: 900px;
  margin: 30px auto;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', sans-serif;
  text-align: center;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 32px;
  margin-top: 20px;
}

.content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  text-align: left;
}

.steps {
  flex: 1;
  font-size: 18px;
}

.steps p {
  margin-bottom: 20px;
}

.qr-box {
  text-align: center;
  width: 180px;
  margin-top: 40px;
  transform: translateX(-70px);
}

.qr-image {
  width: 100%;
  margin-bottom: 8px;
  margin-left: 24px;
}

.qr-caption {
  font-size: 0.9rem;
  margin-left: 48px;
}

.note {
  margin-top: 5px;
  font-size: 19px;
  color: #333;
}

.done-btn {
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
</style>