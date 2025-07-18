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
    const dailyChallenge = ref(null)
    const challengeCompleted = ref(false)

    const handleChatStateChange = (expanded) => {
      isChatExpanded.value = expanded
    }

    // Enhanced daily challenges with better variety and rewards
    const challenges = [
      { 
        id: 1, 
        title: "Merchant Explorer", 
        description: "Discover a new flavor adventure", 
        task: "Order from a merchant you've never tried before and leave a review", 
        reward: 75, 
        icon: "🗺️",
        color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        difficulty: "Easy"
      },
      { 
        id: 2, 
        title: "Early Riser", 
        description: "Beat the breakfast rush", 
        task: "Complete your first two orders before 05:30 AM", 
        reward: 50, 
        icon: "🌅",
        color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        difficulty: "Easy"
      },
      { 
        id: 3, 
        title: "Social Connector", 
        description: "Spread the SMUNCH love", 
        task: "Invite a friend to join SMUNCH community", 
        reward: 150, 
        icon: "🤝",
        color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        difficulty: "Medium"
      },
      { 
        id: 4, 
        title: "Variety Seeker", 
        description: "Embrace culinary diversity", 
        task: "Order from 6 different merchants today", 
        reward: 320, 
        icon: "🎨",
        color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        difficulty: "Medium"
      },
      { 
        id: 5, 
        title: "Weekend Warrior", 
        description: "Make your weekend delicious", 
        task: "Complete 2 orders this weekend", 
        reward: 100, 
        icon: "⚡",
        color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        difficulty: "Easy"
      },
      { 
        id: 6, 
        title: "Dino Master", 
        description: "Become a legendary collector", 
        task: "Unlock 2 new dino characters", 
        reward: 250, 
        icon: "🦕",
        color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        difficulty: "Hard"
      },
      { 
        id: 7, 
        title: "Game Champion", 
        description: "Show your gaming prowess", 
        task: "Spend 30 minutes in the arcade", 
        reward: 200, 
        icon: "🏆",
        color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        difficulty: "Hard"
      }
    ]
    
    const getDailyChallenge = () => {
      const today = new Date().getDay() // 0-6 (Sunday-Saturday)
      return challenges[today]
    }
    
    const completeChallenge = () => {
      if (!challengeCompleted.value) {
        challengeCompleted.value = true
        // Add visual feedback and coin animation
        setTimeout(() => {
          alert(`🎉 Amazing! Challenge "${dailyChallenge.value.title}" completed!\n\n💰 You earned ${dailyChallenge.value.reward} SMUNCH coins!\n🏅 Keep up the great work!`)
        }, 300)
      }
    }


    onMounted(async () => {
      // Set daily challenge
      dailyChallenge.value = getDailyChallenge()
      
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

    return { merchants, goToMerchant, isChatExpanded, handleChatStateChange, dailyChallenge, challengeCompleted, completeChallenge }
  }
})
</script>

<template>
  <div class="order-page-wrapper">
    <div class="order-page" :class="{ faded: isChatExpanded }">
      <!-- Daily Challenge Rectangle -->
      <div v-if="dailyChallenge" class="daily-challenge">
        <div class="challenge-header">
          <img src="/dinoPoint.png" alt="dino" class="challenge-icon" />
          <span class="challenge-title">Daily Challenge</span>
        </div>
        <div class="challenge-task">{{ dailyChallenge.task }}</div>
        <div class="challenge-reward">
          <img src="../assets/smunch_coin.jpg" alt="coin" class="reward-coin" />
          <span>{{ dailyChallenge.reward }} coins</span>
        </div>
      </div>

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

/* Daily Challenge Rectangle */
.daily-challenge {
  position: fixed;
  top: -80px;
  left: 10px;
  z-index: 999;
  height: 130px;
  width: 250px;
  background: linear-gradient(135deg, #9fcbac 0%, #52c094 50%, #49ce52 100%);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: white;
}

.daily-challenge::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

.daily-challenge:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #92c39f 0%, #6cc06e 50%, #56df5f 100%);
}

.challenge-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.challenge-icon {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: iconBounce 2s ease-in-out infinite;
}

.challenge-title {
  font-weight: 800;
  color: #ffffff;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: goldShine 2s ease-in-out infinite;
}

.challenge-task {
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.3;
  font-weight: 600;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.challenge-reward {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.2);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.4);
  justify-content: center;
  backdrop-filter: blur(10px);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  animation: rewardPulse 2s ease-in-out infinite;
  font-size: 0.75rem;
}

.reward-coin {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  animation: coinSpin 3s linear infinite;
}

/* Daily Challenge Animations */
@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes goldShine {
  0%, 100% { 
    background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
    -webkit-background-clip: text;
    background-clip: text;
  }
  50% { 
    background: linear-gradient(45deg, #ffed4e, #fff, #ffed4e);
    -webkit-background-clip: text;
    background-clip: text;
  }
}

@keyframes coinSpin {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
}

@keyframes rewardPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
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
  .order-page {
    padding: 20px 15px;
    padding-top: 100px;
  }
  
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
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .header-section {
    margin-bottom: 40px;
  }
  
  .chat-container {
    top: 70px;
    right: 15px;
  }
  
  .daily-challenge {
    top: 10px;
    left: 10px;
    width: 180px;
    padding: 10px;
    font-size: 0.75rem;
  }
  
  .challenge-task {
    font-size: 0.7rem;
  }
  
  .challenge-title {
    font-size: 0.7rem;
  }
  
  .challenge-reward {
    font-size: 0.7rem;
  }
  
  .challenge-icon {
    width: 35px;
    height: 35px;
  }
}
</style>

<style>
body {
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%) !important;
}
</style>