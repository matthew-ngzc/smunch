<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/utility/axiosInstance'

const route = useRoute()
const router = useRouter()
const status = ref('loading')

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    status.value = 'error'
    return
  }

  try {
    await axiosInstance.get('/api/auth/verify', {
      params: { token }
    })
    status.value = 'success'
  } catch (err) {
    status.value = 'error'
  }
})

function goToLogin() {
  router.push('/login')
}

function goToSignup() {
  router.push('/signup')
}
</script>


<template>
  <div class="verify-page">
    <!-- loading state -->
    <div v-if="status === 'loading'" class="message-box">
      <div class="spinner"></div>
      <p class="text">verifying your account...</p>
    </div>

    <!-- success state -->
    <div v-if="status === 'success'" class="message-box success">
      <img src="/passed.png" alt="success" class="icon" />
      <h2>account verified!</h2>
      <p class="subtext">
        head back to the smunch website and login!
      </p>
      <button @click="goToLogin" class="ok-button">ok</button>
    </div>

    <!-- error state -->
    <div v-if="status === 'error'" class="message-box error">
      <img src="/failed.png" alt="failed" class="icon" />
      <h2>verification failed</h2>
      <p class="subtext">
        we couldn’t find the corresponding token. the link may be invalid or expired.
      </p>
      <button @click="goToSignup" class="ok-button">ok</button>
    </div>
  </div>
</template>



<style>
html, body, #app {
  height: 100%;
  background-color: white;
  overflow-x: 0; 
  overflow-y: 0;
}

</style>


<style scoped> 


.verify-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: white;
  padding: 1rem;
}

.message-box {
  background-color: white;
  box-shadow: 0 0 10px grey;
  padding: 3rem 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin-bottom: 100px;
}

.icon {
  width: 60px;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtext,
.text {
  font-size: 1rem;
  color: #334155;
  max-width: 100%;
  margin-top: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #14b8a6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
}

.ok-button {
  margin-top: 1.5rem;
  background-color: #10b981;
  color: white;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.ok-button:hover {
  background-color: #059669;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .message-box {
    padding: 2.5rem 1.5rem;
    max-width: 350px;
  }
  
  h2 {
    font-size: 1.6rem;
  }
  
  .subtext,
  .text {
    font-size: 0.9rem;
  }
  
  .icon {
    width: 50px;
  }
}

@media (max-width: 480px) {
  .verify-page {
    padding: 0.5rem;
  }
  
  .message-box {
    padding: 2rem 1rem;
    max-width: 300px;
  }
  
  h2 {
    font-size: 1.4rem;
  }
  
  .subtext,
  .text {
    font-size: 0.85rem;
  }
  
  .icon {
    width: 45px;
  }
  
  .ok-button {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
}

</style>