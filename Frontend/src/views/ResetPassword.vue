
<script setup>
import { ref } from 'vue'
import { updateUserPassword } from '@/services/passwordService'
import { useRoute } from 'vue-router'

// token from route
const route = useRoute()
const token = route.query.token

// form states
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')


// password strength check
async function validatePasswordStrength(pwd) {
  if (
    pwd.length < 8 || pwd.length > 128 ||
    !/[a-z]/.test(pwd) ||
    !/[A-Z]/.test(pwd) ||
    !/[0-9]/.test(pwd) ||
    !/[!@#$%^&*(),.?":{}|<script>]/.test(pwd)
  ) {
    return {
      valid: false,
      message: 'password must be 8-128 characters with uppercase, lowercase, number, and symbol'
    }
  }
  return { valid: true }
}

// form submit
async function handleSubmit() {
  error.value = ''
  success.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'passwords do not match'
    return
  }

  const strength = await validatePasswordStrength(password.value)
  if (!strength.valid) {
    error.value = strength.message
    return
  }

  try {
    await updateUserPassword(password.value)
    success.value = 'password updated successfully!'
  } catch (err) {
    error.value = err.response?.data?.message || 'failed to update password'
  }
}
</script>



<template>
  <div class="update-password-container">
    <h2>set a new password</h2>
    <p class="subtext">create a new password. ensure it differs from previous ones for security.</p>

   <form @submit.prevent="handleSubmit">
      <label for="password">password</label>
      <div class="input-wrapper">
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="enter new password"
          :class="{ 'input-error': passwordError }"
          required
        />
      </div>

      <label for="confirm">confirm password</label>
      <div class="input-wrapper">
        <input
          id="confirm"
          type="password"
          v-model="confirm"
          placeholder="confirm new password"
          :class="{ 'input-error': confirmError }"
          required
        />
      </div>

      <span v-if="passwordError" class="error-msg">{{ passwordError }}</span>
      <span v-if="confirmError" class="error-msg">{{ confirmError }}</span>
      <span v-if="success" class="success-msg">{{ success }}</span>

      <button type="submit">update password</button>
    </form>
  </div>
</template>


<style scoped>
.update-password-container {
  max-width: 400px;
  margin: auto;
  padding: 40px 20px;
  text-align: left;
}

h2 {
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.subtext {
  color: gray;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

label {
  margin-top: 16px;
  display: block;
  font-weight: 500;
}

.input-wrapper {
  margin: 8px 0;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

button[type="submit"] {
  padding: 12px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  font-size: 1rem;
}

button[type="submit"]:hover {
  background: #4338ca;
}

.input-error {
  border-color: red;
}

.error-msg {
  color: red;
  font-size: 0.9rem;
  display: block;
  margin-top: 4px;
}

.success-msg {
  color: green;
  margin-top: 12px;
  display: block;
  font-size: 0.95rem;
}
</style>
