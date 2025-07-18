<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router' 
import { useDeliveryStore } from '@/stores/delivery'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useAuthStore } from '@/stores/auth'
import OrderTimeline from '../components/OrderTimeline.vue'
import { createOrder } from '@/services/orderFoodService' 
import { convertToUtcISOString } from '@/utility/orderHelpers'

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
  
  const delivery_time = convertToUtcISOString(deliveryStore.date, deliveryStore.time)

  const payload = {
    customer_id: customerId, 
    merchant_id: merchantId,      
    delivery_fee_cents: 100,
    order_items,
    building: deliveryStore.building,
    room_type: deliveryStore.facilityType,
    room_number: deliveryStore.roomNumber,
    delivery_time
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

  } catch (error) {
    console.error('Order submission failed:', error)
    alert('Failed to submit order. Please try again.')
  }
  
}

// Back button functionality
function goBack() {
  router.go(-1)
}

</script>

<template>
  <div class="summary-page-wrapper">
  <div class="summary-page">

      <!-- pass both data and routes -->
      <OrderTimeline :data="data" />

    <!-- box -->
    <div class="summary-box">

        <div class="back-button" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

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

          <div class="cost-wrapper"> 
            <!--  total cost of items in cart, from script using computed -->
            <span> Total (Excl. delivery fee): </span> 
            <span> ${{ (total-1).toFixed(2) }}</span> 
          </div>

          <div class="total-row">
            <span>Delivery fee:</span>
            <span>$1.00</span>
          </div>
          <div class="total-row bold">
            <span>Total:</span>
            <span>${{ total.toFixed(2) }}</span>
            
          </div>
           <hr />
        </div>

      </div>

      

      <div class="summary-section">
        <h2>Delivery details</h2>

        <div class="delivery-details">
          <p><strong>Location</strong><br />{{ deliveryStore.building }} - {{ deliveryStore.facilityType }} ({{ deliveryStore.roomNumber }})</p>
          <p><strong>Date</strong><br />{{ deliveryStore.date }}</p>
          <p><strong>Time</strong><br />{{ deliveryStore.time }}</p>
        </div>
      </div>

        <button class="next-btn" @click="next">next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-page-wrapper {
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

.summary-page {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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

.cost-wrapper {
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

/* Mobile responsive styles */
@media (max-width: 768px) {
  .summary-page {
    padding: 15px;
  }
  
  .summary-box {
    padding: 30px 25px;
    margin-top: 20px;
  }
  
  .summary-box h2 {
    font-size: 24px;
    margin-top: 15px;
  }
  
  .summary-section h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .summary-contents {
    margin-top: 20px;
  }
  
  .summary-items {
    font-size: 16px;
  }
  
  .item-row.header {
    font-size: 20px;
  }
  
  .right,
  .right-text {
    gap: 20px;
  }
  
  .summary-totals {
    margin-top: 40px;
    margin-bottom: 30px;
    font-size: 16px;
  }
  
  .delivery-details p {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .next-btn {
    width: 90%;
    max-width: 250px;
    padding: 14px 24px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .summary-page {
    padding: 10px;
  }
  
  .summary-box {
    padding: 20px 15px;
    margin-top: 15px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    width: 35px;
    height: 35px;
  }
  
  .summary-box h2 {
    font-size: 20px;
    margin-top: 20px;
  }
  
  .summary-section h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .summary-contents {
    margin-top: 15px;
  }
  
  .summary-items {
    font-size: 14px;
  }
  
  .item-row.header {
    font-size: 16px;
  }
  
  .item-row {
    flex-direction: column;
    gap: 5px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .item-row.header {
    flex-direction: row;
    border-bottom: 1px solid #ccc;
  }
  
  .right,
  .right-text {
    gap: 15px;
    justify-content: space-between;
    width: 100%;
  }
  
  .name {
    font-weight: 500;
  }
  
  .qty,
  .price {
    width: auto;
    text-align: right;
  }
  
  .summary-totals {
    margin-top: 25px;
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .delivery-details p {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .next-btn {
    width: 95%;
    padding: 12px 20px;
    font-size: 16px;
  }
}
</style>
