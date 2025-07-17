<template>
  <div class="verify-page">
    <!-- loading state -->
    <div v-if="status === 'loading'" class="message-block">
      <div class="spinner"></div>
      <p class="text">verifying your account...</p>
    </div>

    <!-- success state -->
    <div v-if="status === 'success'" class="message-block success">
      <img src="/passed.png" alt="success" class="icon success-icon" />
      <h2>account verified!</h2>
    </div>

    <!-- error state (the one in the screenshot) -->
    <div v-if="status === 'error'" class="message-block error">
      <img src="/failed.png" alt="failed" class="icon error-icon" />
      <h2>verification failed</h2>
      <p class="subtext">
        we couldn’t find the corresponding token. the link may be invalid or expired.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axiosInstance from '@/utility/axiosInstance'

const route = useRoute()
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
</script>

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
  width: 100%;
  flex-direction: column;
  background-color: #ffffff;
  text-align: center;
  padding: 2rem;
}

.message-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon {
  width: 50px;
  margin-top: 100px;
}


.text,
.subtext {
  font-size: 1rem;
  color: #334155;
  max-width: 400px;
}

h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #14b8a6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
