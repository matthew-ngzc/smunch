<template>
  <div class="verify-page">
    <h1>Verifying your email...</h1>
    <p v-if="status === 'success'"> Your email has been suceesfully verified!</p>
    <p v-if="status === 'error'"> The verification failed. Please try again.</p>
  </div>
</template>

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
    await axiosInstance.post('/api/auth/verify-email', { token }) // your backend route
    status.value = 'success'
    // optionally redirect after 2 seconds
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    status.value = 'error'
  }
})
</script>
