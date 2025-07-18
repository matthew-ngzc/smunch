<script setup>
import { ref } from 'vue'
import { resetUserPassword } from '@/services/passwordService'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()

function goToLogin() {
  router.push('/login')
}

const route = useRoute()
const token = route.query.token

const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const confirmError = ref('')
const error = ref('')
const success = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

// password strength check
function validatePasswordStrength(pwd) {
  if (
    pwd.length < 8 || pwd.length > 128 ||
    !/[a-z]/.test(pwd) ||
    !/[A-Z]/.test(pwd) ||
    !/[0-9]/.test(pwd) ||
    !/[!@#$%^&*(),.?":{}|<script>]/.test(pwd)
  ) {
    return {
      valid: false,
      message: 'password must be 8–128 characters with uppercase, lowercase, number, and symbol.'
    }
  }
  return { valid: true }
}

async function handleSubmit() {
  passwordError.value = ''
  confirmError.value = ''
  error.value = ''
  success.value = ''

  // check confirm match
  if (password.value !== confirmPassword.value) {
    confirmError.value = 'passwords do not match'
    return
  }

  // check strength
  const strength = validatePasswordStrength(password.value)
  if (!strength.valid) {
    passwordError.value = strength.message
    return
  }

  try {
    await resetUserPassword(password.value, token)
    success.value = 'password updated successfully!'
  } catch (err) {
    error.value = err.response?.data?.message || 'failed to update password'
  }
}
</script>


<template>
  <div class="update-password-container">
    <h2>Set a new password</h2>
    <p class="subtext">Your new password must must include (8–128 characters) with at least one uppercase, one lowercase, a number, and a symbol.</p>

   <form @submit.prevent="handleSubmit">
      <label for="password">Password</label>
          <div class="input-wrapper password-input-container">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="enter new password"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :title="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg v-if="showPassword" class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                </svg>
              </button>
            </div>


      <label for="confirm">Confirm Password</label>
        <div class="input-wrapper password-input-container">
            <input
              id="confirm"
              :type="showConfirm ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="confirm new password"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirm = !showConfirm"
              :title="showConfirm ? 'Hide password' : 'Show password'"
            >
              <!-- same svg icons as above -->
              <svg v-if="showConfirm" class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
              </svg>
            </button>
          </div>

      <span v-if="passwordError" class="error-msg">{{ passwordError }}</span>
      <span v-if="confirmError" class="error-msg">{{ confirmError }}</span>
      <span v-if="success" class="success-msg">{{ success }}</span>

      <button type="submit">Reset password</button>
    </form>

    <div v-if="success" class="modal-overlay">
  <div class="modal-box">
    <h3> Password changed!</h3>
    <p> Your password reset has been successful.</p>
    <button @click="goToLogin">continue to login</button>
  </div>
</div>

  </div>
</template>


<style scoped>
.update-password-container {
  max-width: 700px;
  margin: auto;
  padding: 100px;
  text-align: left;
  margin-top: 100px;
  background: white;
  box-shadow: 0 0 10px grey;
  border-radius: 20px;
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

.password-input-container {
  position: relative;
  width: 100%;
  margin: 12px 0;
}

.password-input-container input {
  width: 100%;
  padding: 10px 40px 10px 12px; /* right space for eye icon */
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  width: 18px;
  height: 18px;
}



button[type="submit"] {
  padding: 12px;
  background: #007a3d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  font-size: 1rem;
}

button[type="submit"]:hover {
  background: #036232;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: white;
  padding: 26px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  max-width: 700px;
  height: 200px;
  display: flex;
  flex-direction: column;
}

.modal-box h3 {
  font-size: 19px;
}

.modal-box p {
  font-size: 15px;
  margin-top: 15px;
}

.modal-box button {
  margin-top: 40px;
  padding: 6px 14px;
  background: #007a3d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

 
}

.modal-box button:hover {
  background: #036232; /* darker green */
}




</style>
