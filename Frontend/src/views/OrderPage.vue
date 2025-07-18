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
      <!-- ChatBar Component -->
      <div class="chat-container">
        <ChatBar @chatStateChange="handleChatStateChange"/>
      </div>

      <!-- Main Content -->
      <div class="order-content">
        <!-- Header Section -->
        <div class="header-section">
          <div class="header-accent"></div>
          <h1 class="page-title">Order with SMUNCH!</h1>
          <p class="page-subtitle">Choose your favorite restaurant and let us handle the rest</p>
        </div>

        <!-- Merchant Grid -->
        <div class="merchant-grid">
          <div
            v-for="merchant in merchants"
            :key="merchant.id"
            class="merchant-card"
            @click="goToMerchant(merchant.merchant_id)"
          >
            <div class="card-glow"></div>
            <div class="card-content">
              <div class="logo-container">
                <img :src="merchant.image_url" alt="merchant logo" class="merchant-logo" />
                <div class="logo-overlay"></div>
              </div>
              <div class="merchant-info">
                <h3 class="merchant-name">{{ merchant.name }}</h3>
                <div class="delivery-info">
                  <span class="delivery-fee">$1.00 delivery fee</span>
                  <div class="delivery-badge">
                    <svg class="delivery-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-hover-effect"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="merchants.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>No restaurants available</h3>
          <p>Check back later for new options!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Page Layout */
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
  padding: 40px 30px;
  font-family: 'Inter', sans-serif;
  padding-top: 140px;
  position: relative;
  width: 100%;
  max-width: 1400px;
  animation: fadeInUp 0.6s ease-out;
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

/* Chat Container */
.chat-container {
  position: fixed;
  top: 80px;
  right: 30px;
  z-index: 1000;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.header-accent {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #38c172, #2f855a);
  margin: 0 auto 24px;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(56, 193, 114, 0.3);
}

.page-title {
  font-size: 3.2rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  background: linear-gradient(135deg, #134e4a 0%, #0d3d31 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #468d8c;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

/* Merchant Grid */
.merchant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 40px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

/* Merchant Card */
.merchant-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  overflow: hidden;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.merchant-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(44, 62, 80, 0.15);
  background: rgba(255, 255, 255, 0.98);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(56, 193, 114, 0.1) 0%, rgba(47, 133, 90, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 24px;
}

.merchant-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-container {
  position: relative;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(176, 247, 239, 0.1) 0%, rgba(255, 255, 255, 0.8) 100%);
  border: 1px solid rgba(176, 247, 239, 0.3);
  transition: all 0.3s ease;
}

.merchant-card:hover .logo-container {
  background: linear-gradient(135deg, rgba(176, 247, 239, 0.2) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-color: rgba(56, 193, 114, 0.4);
}

.merchant-logo {
  max-height: 100px;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(44, 62, 80, 0.15));
  transition: all 0.3s ease;
}

.merchant-card:hover .merchant-logo {
  transform: scale(1.05);
  filter: drop-shadow(0 6px 16px rgba(44, 62, 80, 0.2));
}

.logo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.merchant-card:hover .logo-overlay {
  opacity: 1;
}

.merchant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.merchant-name {
  font-size: 1.4rem;
  color: #134e4a;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.3;
  text-align: center;
}

.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.delivery-fee {
  font-size: 1rem;
  color: #468d8c;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(176, 247, 239, 0.3) 0%, rgba(255, 255, 255, 0.8) 100%);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(176, 247, 239, 0.4);
}

.delivery-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #38c172;
  font-weight: 600;
}

.delivery-icon {
  width: 16px;
  height: 16px;
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 24px;
  pointer-events: none;
}

.merchant-card:hover .card-hover-effect {
  opacity: 1;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: #468d8c;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #134e4a;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-state p {
  color: #468d8c;
  font-size: 1rem;
  margin: 0;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .merchant-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .order-page {
    padding: 30px 20px;
    padding-top: 120px;
  }
  
  .page-title {
    font-size: 2.4rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
  }
  
  .merchant-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
  
  .merchant-card {
    padding: 24px 20px;
    min-height: 280px;
  }
  
  .logo-container {
    height: 120px;
    margin-bottom: 20px;
  }
  
  .merchant-logo {
    max-height: 80px;
  }
  
  .merchant-name {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .merchant-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .merchant-card {
    padding: 20px 16px;
    min-height: 260px;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>

<style>
body {
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%) !important;
}
</style>