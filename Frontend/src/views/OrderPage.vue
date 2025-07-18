<script lang="js">
import { defineComponent, onMounted, ref } from 'vue'
import { fetchParentMerchants, getChildMerchants, getMerchantInfoById } from '@/services/orderFoodService'
import { useOrderStore } from '@/stores/order'
import { useRouter } from 'vue-router'
import DinoWeather from '@/components/DinoWeather.vue'
import Navbar from '@/components/Navbar.vue'
import ChatBar from '@/components/ChatBar.vue'


export default defineComponent({
  components: {
    ChatBar
  },
  setup() {
    const merchants = ref([])
    const orderStore = useOrderStore()
    const router = useRouter()
    const isChatExpanded = ref(false)

    const handleChatStateChange = (expanded) => {
      isChatExpanded.value = expanded
    }


    onMounted(async () => {
      try {
        // function to get merchants from backend
        const response = await fetchParentMerchants() // Adjust to your actual endpoint
        console.log(response)
        merchants.value = response.data
      } catch (error) {
        console.error('Failed to load merchants:', error)
      }
    })

    const goToMerchant = async (merchantId) => {

    try {
      // fetch merchant info (to check if it has children)
      const res = await getMerchantInfoById(merchantId)
      const merchant = res.data
      console.log('merchant info:', merchant)


      if (merchant.has_children) {
        //  fetch and replace current merchant list with its children
        const childRes = await getChildMerchants(merchantId)
        merchants.value = childRes.data
      } else {
        // go to order page as usual
        orderStore.setMerchantId(merchantId)
        router.push({ name: 'orderMerchant', params: { id: merchantId } })
      }

    } catch (err) {
      console.error('error handling merchant click:', err)
    }
  }

    return { merchants, goToMerchant, isChatExpanded, handleChatStateChange }
  }
})
</script>

<template>
  <div class="order-page-wrapper">
  <div class="order-page" :class="{ faded: isChatExpanded }">
    <!-- Search Bar -->
    <!-- <div class="chat-search-bar">
      <input type="text" placeholder="Order with SMUNCH.AI !" class="chat-input" />
      <button class="chat-send-btn">Send</button>
    </div> -->
    <div>
      <ChatBar @chatStateChange="handleChatStateChange"/>
    </div>

    <div class="order-content">
      <hr class="divider" />

      <h2>order something with SMUNCH!</h2>
      <div class="merchant-list">
        <div
          v-for="merchant in merchants"
          :key="merchant.id"
          class="merchant-card"
          @click="goToMerchant(merchant.merchant_id)"
        >
          <div class="logo-wrapper">
            <img :src="merchant.image_url" alt="merchant logo" class="merchant-logo" />
          </div>
          <div class="text">
            <h3>{{ merchant.name }}</h3>
            <p>$1.00 delivery fee</p>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </div> 
</template>

<style scoped>
.order-page-wrapper {
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

.order-page {
  padding: 30px;
  font-family: 'Inter', sans-serif;
  padding-top: 120px; /* Ensures content is not hidden behind the fixed ChatBar */
  position: relative;
  width: 100%;
  max-width: 1200px;
}

.order-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  pointer-events: none;
  z-index: 998;
  transition: opacity 0.3s ease;
}

.order-page.faded::before {
  opacity: 1;
}

.order-page h1 {
  margin-top: 30px;
  margin-bottom: 18px;
  font-size: 2.2rem;
  font-weight: 800;
  color: #134e4a;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}

.order-page h2 {
  margin-top: 60px;
  margin-bottom: 18px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #134e4a;
}

/* New Chat-like Search Bar
.chat-search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.10);
  padding: 6px 10px 6px 24px;
  margin: 70px 0 24px 0;
  max-width: 600px;
  width: 100%;
  position: relative;
}
.order-content {
  margin-top: 40px;
}
.chat-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.15rem;
  padding: 12px 0;
  color: #444;
}
.chat-input::placeholder {
  color: #b0b6be;
  opacity: 1;
}
.chat-send-btn {
  background: #38c172;
  color: #fff;
  border: none;
  border-radius: 18px;
  font-size: 0.98rem;
  font-weight: 700;
  padding: 7px 18px;
  margin-left: 10px;
  margin-right: 2px;
  box-shadow: 0 2px 8px rgba(143,79,255,0.10);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  position: relative;
  z-index: 2;
}
.chat-send-btn:hover {
  background: #0d3d31;
  box-shadow: 0 4px 16px rgba(143,79,255,0.16);
} */

.divider {
  border: none;             
  height: 1px;               
  background-color: #524f4f;   
  margin: 40px 0 16px;        /* space above/below the line */
}

.merchant-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 40px;
  margin-top: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 1200px;
  padding-bottom: 16px;
  padding-top: 16px;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #0d3d31 #ffffff;
  position: relative;
  scroll-snap-type: x mandatory;
}
.merchant-list > .merchant-card {
  scroll-snap-align: start;
}
.merchant-list-fade {
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  z-index: 2;
}
.merchant-list-fade.left {
  left: 0;
  background: linear-gradient(90deg, #e0f7fa 80%, rgba(224,247,250,0));
}
.merchant-list-fade.right {
  right: 0;
  background: linear-gradient(270deg, #e0f7fa 80%, rgba(224,247,250,0));
}
.merchant-card {
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 18px;
  padding: 24px 18px 18px 18px;
  min-width: 170px;
  height: 240px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.10);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
  cursor: pointer;
  position: relative;
  scroll-snap-align: start;
  overflow: hidden;
  max-width: 100px;
}
.merchant-card:hover {
  transform: translateY(-4px) scale(1.045);
  box-shadow: 0 16px 40px rgba(44, 62, 80, 0.18);
  background: #e0f2f1;
}
.merchant-card::after {
  content: '';
  display: block;
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.01) 80%);
  transition: opacity 0.18s;
}
.merchant-card:hover::after {
  opacity: 1;
  animation: shine 0.7s linear;
}
@keyframes shine {
  0% { opacity: 0; }
  30% { opacity: 1; }
  100% { opacity: 0; }
}
.logo-wrapper {
  height: 100px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #0d3d31;
  padding-bottom: 14px;
  margin-bottom: 2px;
}
.merchant-logo {
  max-height: 90px;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(44, 62, 80, 0.10));
}
.merchant-card h3 {
  font-size: 1.08rem;
  color: #134e4a;
  font-weight: 700;
  margin: 0;
  margin-top: 6px;
}
.merchant-card p {
  font-size: 0.85rem;
  color: #4b5563;
  margin: 0;
  margin-top: 2px;
}
@media (max-width: 900px) {
  .merchant-list {
    gap: 18px;
    max-width: 98vw;
  }
  .merchant-card {
    min-width: 130px;
    height: 180px;
    padding: 14px 8px 10px 8px;
  }
  .logo-wrapper {
    height: 60px !important;
    padding-bottom: 8px;
  }
  .merchant-logo {
    max-height: 50px;
  }
}
</style>

<style>
body {
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%) !important;
}
</style>