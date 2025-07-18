<script lang="js">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import OrderIcon from '@/assets/order-icon.png'
import RunIcon from '@/assets/run-icon.png'
import { useAuthStore } from '@/stores/auth'
import DinoWeather from '@/components/DinoWeather.vue'
import axiosInstance from '@/utility/axiosInstance'

export default defineComponent({
  name: 'Home',
  components: { DinoWeather },
  setup() {
    const router = useRouter()
    const auth = useAuthStore()
    const userName = auth.userName
    const showWelcomeMessage = ref(false)
    const weather = ref(null)
    const weatherLoaded = ref(false)

    
    const goToOrder = () => { router.push('/order') }
    const goToRun = () => { router.push('/run') }
    

    
          onMounted(async () => {
        // Show welcome message if user just logged in
      const justLoggedIn = sessionStorage.getItem('justLoggedIn')
      if (justLoggedIn === 'true') {
        showWelcomeMessage.value = true
        sessionStorage.removeItem('justLoggedIn')
        
        // Hide the message after 3 seconds
        setTimeout(() => {
          showWelcomeMessage.value = false
        }, 3000)
      }
      try {
        const res = await axiosInstance.get('/api/weather/rain-status')
        weather.value = res.data
      } catch (e) { 
        console.warn('Weather API failed:', e)
        // Fallback weather data so DinoWeather still shows
        weather.value = { raining: false, message: "Life's good. Let's get SMUNCHIN' !" }
      }
      weatherLoaded.value = true
    })
    
          return { 
        userName, 
        OrderIcon, 
        RunIcon, 
        goToOrder, 
        goToRun,
        showWelcomeMessage,
        weather,
        weatherLoaded
      }
  }
})
</script>

<template>
  <div class="home no-scroll">


    <!-- Welcome Message -->
    <div v-if="showWelcomeMessage" class="welcome-message">
      <div class="welcome-content">
        <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>Welcome back, {{ userName }}! You've successfully logged in.</span>
      </div>
    </div>
    
    <div class="home-content">
      <h1 class="greeting">Hi {{ userName || 'sexy' }}, what would you like to do today?</h1>
      <div class="options">
        <div class="card order" @click="goToOrder">
          <img src="../assets/order-icon.png" alt="order icon" class="icon" />
          <p>Order with SMUNCH!</p>
        </div>
        <div class="card run" @click="goToRun">
          <img src="../assets/run-icon.png" alt="run icon" class="icon" />
          <p>Run with SMUNCH!</p>
        </div>
      </div>
    </div>
    <DinoWeather v-if="weatherLoaded && weather" :raining="weather.raining" :message="weather.message" />
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }
.home.no-scroll {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}



.home-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.welcome-message {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
  animation: slideDown 0.5s ease-out;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.95rem;
}

.success-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.greeting {
  font-size: 2.6rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 2.5rem;
  text-align: center;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}

.options {
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: center;
}

.card {
  width: 270px;
  height: 270px;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  cursor: pointer;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.85);
  transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
  border: 1.5px solid #e0e0e0;
}

.card:hover {
  transform: translateY(-10px) scale(1.04);
  box-shadow: 0 16px 48px rgba(44, 62, 80, 0.18);
  background: #e0f2f1;
}

.order {
  background: linear-gradient(135deg, #5ea6c4 0%, #b2f7ef 100%);
  color: #134e4a;
}

.run {
  background: linear-gradient(135deg, #468d8c 0%, #b2f7ef 100%);
  color: #134e4a;
}

.icon {
  width: 100px;
  height: 100px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 2px 8px rgba(44, 62, 80, 0.10));
}

.card p {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

@media (max-width: 900px) {
  .options {
    flex-direction: column;
    gap: 2rem;
  }
  .card {
    width: 90vw;
    max-width: 350px;
    height: 200px;
    padding: 1.5rem 1rem;
  }
}



@media (max-width: 480px) {
  .home-content {
    padding: 1rem;
  }
  
  .greeting {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .options {
    gap: 1.5rem;
  }
  
  .card {
    width: 95vw;
    max-width: 300px;
    height: 180px;
    padding: 1.2rem 0.8rem;
  }
  
  .icon {
    width: 70px;
    height: 70px;
    margin-bottom: 1rem;
  }
  
  .card p {
    font-size: 1.1rem;
  }
  
  .welcome-message {
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 90vw;
    padding: 10px 16px;
  }
  
  .welcome-content {
    font-size: 0.85rem;
  }
  
  .home-content {
    position: relative;
    padding: 60px 1rem 1rem;
  }
}
</style>