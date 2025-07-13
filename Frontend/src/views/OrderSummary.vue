<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router' 
import { useDeliveryStore } from '@/stores/delivery'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useAuthStore } from '@/stores/auth'
import ordertimeline from '../components/ordertimeline.vue'
import { createOrder } from '@/services/orderFoodService' 

   // progress timeline
    const data = {
      steps: [ 'order details', 'delivery location', 'order confirmation', 'payment'],
      currentStep: 3,
      activeColor: 'rgb(0, 0, 0)',
      passiveColor: 'grey',
    };

const router = useRouter() 
const deliveryStore = useDeliveryStore()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const authStore = useAuthStore() 

const total = computed(() =>
  cartStore.items.reduce((sum, item) => sum + item.quantity * item.price, 0) + 1 // Include $1.00 delivery fee
)

const next = async () => {

  const merchantId = orderStore.selectedMerchantId
  const customerId = authStore.userId

  const order_items = cartStore.items.map(item => ({
    menu_item_id: item.id,
    quantity: item.quantity,
    customisations: item.customisations || {},
    notes: item.notes || ''
  }))

  const payload = {
    customer_id: customerId, 
    merchant_id: merchantId,      
    delivery_fee_cents: 100,
    order_items,
    building: deliveryStore.building,
    room_type: deliveryStore.facilityType,
    room_number: deliveryStore.floor,
    delivery_time: new Date(`${deliveryStore.date}T${convertTo24Hr(deliveryStore.time)}:00Z`).toISOString()
  }

  try {
    //TEST
    console.log('Cart Items:', cartStore.items)
    console.log('Full Payload:', payload)
    console.log('Order Items Payload:', order_items)

    const response = await createOrder(payload)
    
    orderStore.setOrderId(response.data.order.order_id)
    orderStore.setPaymentDetails({
      qrCode: response.data.qrCode,
      paymentReference: response.data.payment_reference,
      paynowNumber: response.data.paynow_number
    })

    await router.push({ name: 'payment' })
    orderStore.setMerchantId(null)  // Reset merchant ID
    // console.log(orderStore.selectedMerchantId)

  } catch (error) {
    console.error('Order submission failed:', error)
    alert('Failed to submit order. Please try again.')
  }
  
}

// helper method
function convertTo24Hr(timeStr) {
  const [time, modifier] = timeStr.split(' ')
  let [hours, minutes] = time.split(':')

  if (modifier === 'PM' && hours !== '12') {
    hours = String(parseInt(hours) + 12)
  } else if (modifier === 'AM' && hours === '12') {
    hours = '00'
  }

  return `${hours.padStart(2, '0')}:${minutes}`
}

</script>

<template>
  <div class="summary-page">

    <div class="timeline-wrapper">
      <ordertimeline :data="data" />
    </div>

    <!-- box -->
    <div class="summary-box">

      <h2>Order summary</h2>

      <!-- content inside box -->
      <div class="summary-contents">

        <div class="summary-items">
          <div class="item-row header">
            <div>Item</div> 
            <div class="right">
              <div>Quantity</div> 
              <div>Price</div>
            </div>
            
          </div>
          <!--  loop through each item in cart and present info -->
          <div v-for="item in cartStore.items" :key="item.id" class="item-row">
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
        <h2>Delivery details</h2>

        <div class="delivery-details">
          <p><strong>Location</strong><br />{{ deliveryStore.building }} {{ deliveryStore.floor }} - {{ deliveryStore.facilityType }}</p>
          <p><strong>Date</strong><br />{{ deliveryStore.date }}</p>
          <p><strong>Time</strong><br />{{ deliveryStore.time }}</p>
        </div>
      </div>

      <button class="next-btn" @click="next">next</button>
    </div>
  </div>
</template>

<style scoped>

.timeline-wrapper {
  width: 100%;
  align-self: stretch !important; /* forces it to ignore align-items: center */
}


.summary-box {
  max-width: none !important;
  margin-top: 30px;
}

.summary-box h2 {
  font-size: 30px;
  font-weight: bold;
}




.summary-box {
  background: #fff;
  border-radius: 16px;
  padding: 50px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.summary-contents {
  margin-top: 29px;
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
  font-weight: bold;
}

.next-btn:hover {
   background-color: #036232;
}
</style>
