<template>
  <div>
    <label class="tg-label">link your telegram</label>

    <div v-if="step === 1" class="tg-box-row">
      <input
        v-model="telegramHandle"
        placeholder="enter telegram handle (without @)"
        class="tg-input full-input"
      />
      <button type="button" @click="requestOtp" class="tg-btn-inline">get otp link</button>
    </div>

    <div v-if="step === 2" class="tg-box">
      <p class="tg-instruction"> click below to verify in telegram:</p>
      <a :href="link.telegram_link_app" class="tg-link">open in telegram app</a>
      <p class="tg-fallback">or <a :href="link.telegram_link_web" target="_blank">open in browser</a></p>

      <p class="tg-instruction"> return and click verify:</p>
      <button type="button" @click="verifyOtp" class="tg-btn">verify</button>
    </div>

    <div v-if="step === 3" class="tg-success">
        verified as @{{ telegramHandle }}
    </div>

    <p v-if="error" class="tg-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const telegramHandle = ref('')
const otp = ref('')
const link = ref({})
const step = ref(1)
const error = ref('')

const requestOtp = async () => {
  error.value = ''
  try {
    const res = await axios.post('http://localhost:5000/request-otp', {
      telegram_handle: telegramHandle.value.toLowerCase().replace(/^@/, '')
    })
    otp.value = res.data.otp
    link.value = {
      telegram_link_web: res.data.telegram_link,
      telegram_link_app: `tg://resolve?domain=smunchbot&start=verify_${res.data.otp}`
    }
    step.value = 2
  } catch (e) {
    error.value = 'failed to request otp.'
  }
}

const verifyOtp = async () => {
  error.value = ''
  try {
    const res = await axios.post('http://localhost:5000/verify-otp', {
      otp: otp.value,
      telegram_handle: telegramHandle.value
    })
    step.value = 3
  } catch (e) {
    error.value = 'verification failed. make sure you clicked start in telegram.'
  }
}
</script>

<style scoped>
.tg-label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  color: #134e4a;
}
.tg-box-row {
  display: flex;
  gap: 0.7rem;
  margin-bottom: 1rem;
  align-items: center;
}
.tg-box {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1rem;
}
.tg-input.full-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1.5px solid #e0e0e0;
  font-size: 1rem;
  background: #f8fafc;
  color: #134e4a;
  transition: border 0.2s;
}
.tg-input.full-input:focus {
  border-color: #0d3d31;
  outline: none;
}
.tg-btn-inline {
  background: #059669;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
}
.tg-btn {
  background: #059669;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
.tg-link {
  color: #0284c7;
  font-weight: 500;
  text-decoration: underline;
}
.tg-fallback {
  font-size: 0.9rem;
  color: #555;
}
.tg-error {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.tg-success {
  color: green;
  font-weight: 600;
  margin-top: 0.5rem;
}
.tg-instruction {
  font-size: 0.95rem;
  color: #134e4a;
}
</style>

