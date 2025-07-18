<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart' 
import { useRouter } from 'vue-router' 
import { updatePaymentStatus } from '@/services/orderFoodService' 
import { useOrderStore } from '@/stores/order'

// importing the timeline
import OrderTimeline from '../components/OrderTimeline.vue'


// progress timeline
  const data = {
    steps: [ 'order details', 'delivery location', 'order confirmation', 'payment'],
    currentStep: 4,
    activeColor: 'rgb(0, 0, 0)',
    passiveColor: 'grey',
  };

const router = useRouter() 
const cart = useCartStore()
const orderStore = useOrderStore()
const orderId = orderStore.orderId

const qrCode = computed(() => orderStore.qrCode)
const paymentReference = computed(() => orderStore.paymentReference)
const paynowNumber = computed(() => orderStore.paynowNumber)

const total = computed(() =>
  cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0) + 1 // +$1 delivery
)

const done = async () => {
  try {
    await updatePaymentStatus(orderId) 
    router.push({ name: 'Home' })
  } catch (err) {
    console.error('Failed to update payment status:', err)
    alert('Something went wrong while confirming payment. Please try again.')
  }

  router.push({ name: 'activeorders' })
}

// Back button functionality
function goBack() {
  router.go(-1)
}

</script>

<template>
  <div class="payment-page-wrapper">
  <div class="payment-page">
     <!-- pass both data and routes -->
    <OrderTimeline :data="data" :routes="routes" />
  
  <div class="payment-container">

      <div class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

    <h2 class="title">Follow the steps below to proceed with payment.</h2><br />

    <div class="content">
      <!-- Steps -->
      <div class="steps">
        <p><strong>STEP 1:</strong><br />
        PayNow <strong>${{ total.toFixed(2) }}</strong> via QR or Mobile to <strong>{{ paynowNumber }} </strong>.<br />
        Enter your reference number <strong>{{ paymentReference }}</strong> in the PayNow comments.</p><br />

        <p><strong>STEP 2:</strong><br />
        Send your payment screenshot to <strong>@smunch_bot</strong> via telegram.</p><br />

        <p><strong>STEP 3:</strong><br />
          Press "done" once payment has been made!</p><br />
      </div>

      <!-- QR Code -->
      <div class="qr-box">
        <img :src="qrCode" alt="PayNow QR Code" class="qr-image" />
          <p class="qr-caption">Paynow recipient's name: <strong>Matt</strong></p>
      </div>
    </div>

    <p class="note">
      You will receive a confirmation from Smunch Admin within 1–2 days.
    </p>

    <button class="done-btn" @click="done">done</button>
  </div>
    </div>
  </div>
</template>

<style scoped>
.payment-page-wrapper {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
}

.payment-page {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

.payment-container {
  max-width: 1500px;
  width: 1000px;
  margin: 30px auto;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  font-family: 'Inter', sans-serif;
  text-align: center;
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
  width: 220px;
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
  margin-top: 6px;
  margin-left: 20px;
  text-align: center; 
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

/* Mobile responsive styles */
@media (max-width: 768px) {
  .payment-page {
    padding: 15px;
  }
  
  .payment-container {
    width: 95%;
    margin: 20px auto;
    padding: 25px 20px;
  }
  
  .title {
    font-size: 1.4rem;
    margin-bottom: 25px;
  }
  
  .content {
    flex-direction: column;
    gap: 25px;
    text-align: center;
  }
  
  .steps {
    font-size: 16px;
  }
  
  .qr-box {
    width: 180px;
    margin: 0 auto;
    transform: none;
  }
  
  .qr-image {
    margin-left: 0;
  }
  
  .qr-caption {
    margin-left: 0;
    text-align: center;
  }
  
  .note {
    font-size: 16px;
    margin-top: 20px;
  }
  
  .done-btn {
    width: 90%;
    max-width: 250px;
    padding: 14px 24px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .payment-page {
    padding: 10px;
  }
  
  .payment-container {
    width: 100%;
    margin: 15px auto;
    padding: 20px 15px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    width: 35px;
    height: 35px;
  }
  
  .title {
    font-size: 1.2rem;
    margin-bottom: 20px;
    margin-top: 25px;
  }
  
  .content {
    gap: 20px;
  }
  
  .steps {
    font-size: 14px;
  }
  
  .steps p {
    margin-bottom: 15px;
  }
  
  .qr-box {
    width: 150px;
  }
  
  .qr-caption {
    font-size: 0.8rem;
  }
  
  .note {
    font-size: 14px;
    margin-top: 15px;
  }
  
  .done-btn {
    width: 95%;
    padding: 12px 20px;
    font-size: 16px;
  }
}
</style>