<script setup>
import { ref } from 'vue'
import { requestResetLink } from '@/services/passwordService'

const email = ref('')
const error = ref('')
const success = ref('')
const emit = defineEmits(['close'])

async function handleReset() {
  error.value = ''
  success.value = ''

  if (!email.value.includes('@smu.edu.sg')) {
    error.value = 'Please enter a valid smu email'
    return
  }

  try {
    await requestResetLink(email.value)
    success.value = 'Reset link sent! Check your email.'
  } catch (err) {
    error.value = err.response?.data?.message || 'failed to send reset link'
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="header-row">
        <h2 class="title">Reset your password</h2>
        <button class="close-button" @click="emit('close')">✕</button>
      </div>

      <div class="text-wrapper">
        <span class="subtext">Enter your smu email and we’ll send you a</span>
        <span class="subtext2">reset link.</span>
      </div>


      <form @submit.prevent="handleReset">
        <input
          type="email"
          v-model="email"
          placeholder="your smu email"
          :class="{ 'input-error': error }"
          required
        />
        <span v-if="error" class="error-msg">{{ error }}</span>
        <button type="submit" :disabled="isLoading">send reset link</button>
        <p v-if="success" class="success-msg">{{ success }}</p>
      </form>

    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  width: 430px;
 
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  color: black;
}

.header-row {
  display: flex;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #222;
  cursor: pointer;
  margin-bottom: 6px;
}

.title {
  position: absolute;        
  left: 50%;                 
  transform: translateX(-50%);
  font-size: 20px;
  white-space: nowrap;
  margin-top: 3px;
}

.text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center; /* this centers children horizontally */
  text-align: center;
}

.subtext,
.subtext2 {
  font-size: 0.95rem;
  color: #444;
  display: block;
}


input {
  width: 100%;
  padding: 10px;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

.input-error {
  border-color: red;
}

button[type="submit"] {
  padding: 10px 20px;
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  font-size: 1rem;
  transition: background 0.3s ease;
}

button[type="submit"]:hover {
  background: #047857; /* darker green */
}

.error-msg {
  color: rgb(144, 25, 25);
  font-size: 0.9rem;
  margin-left: 56px;
  margin-bottom: -10px;
}

.success-msg {
  color: rgb(45, 169, 20);
  margin-top: 10px;
  font-size: 0.9rem;
  margin-left: 56px;
  margin-bottom: -10px;
}
</style>
