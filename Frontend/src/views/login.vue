<template>
  <div class="login-container">
    <!-- Left: White with background image -->
    <div class="login-left">
      <div class="left-content">
        <h2 class="welcome">Welcome back!</h2>
        <p class="tagline">
          <span class="tagline-continued">By students, for students.</span>
        </p>
      </div>
    </div>

    <!-- Right: Green -->
    <div class="login-right">
      <div class="right-content">
        <h1 class="logo">SMUNCH</h1>
        <h2 class="subheading">Login with your SMU email!</h2>

        <form @submit.prevent="handleLogin" class="form-fields">
          <div class="input-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              v-model="email" 
              type="text" 
              :class="{ 'input-error': emailError }"
              placeholder="Enter your SMU email" 
              required 
            />
            <span :class="['error-msg', { show: emailError }]">{{ emailError }}</span>
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <div class="password-input-container">
              <input 
                id="password" 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'"
                :class="{ 'input-error': passwordError }"
                placeholder="Enter your password" 
                required 
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="togglePassword"
                :title="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg v-if="showPassword" class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                <svg v-else class="eye-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                </svg>
              </button>

               <p class="forgot-password">
                <span class="forgot-password-link" @click="showPopup = true">Forgot your password?</span>
              </p>

                <PasswordPopup v-if="showPopup" @close="showPopup = false" />


            </div>
            <span :class="['error-msg', { show: passwordError }]">{{ passwordError }}</span>
          </div>

          <button type="submit" class="login-btn">
            <span>Log In</span>
          </button>
        </form>

        <p class="signup-prompt">
          Don't have an account? 
          <router-link to="/signup">Sign up</router-link> now! 
        </p>
        
        <!-- Email Verification Success Message -->
        <div v-if="showVerificationSuccess" class="verification-success">
          <div class="verification-content">
            <svg class="verification-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>Email verified successfully! You can now log in.</span>
          </div>
        </div>

        <!-- Logout Success Message -->
        <div v-if="showLogoutSuccess" class="verification-success">
          <div class="verification-content">
            <svg class="verification-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>Logged out successfully!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import axiosInstance from '@/utility/axiosInstance'
import PasswordPopup from '@/components/passwordPopup.vue'


export default {
  components: { PasswordPopup },

  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      showPassword: false,
      showVerificationSuccess: false,
      showLogoutSuccess: false,
      showPopup: false

    };
  },
  mounted() {
    this.checkForVerificationSuccess();
    this.checkForLogoutSuccess();
  },
  methods: {
    validateEmail() {
      if (!this.email.trim()) {
        this.emailError = 'Email is required.';
        return false;
      }
      if (!this.email.includes('@smu.edu.sg')) {
        this.emailError = 'Please enter a valid SMU email address.';
        return false;
      }
      const emailRegex = /^[^\s@]+@smu\.edu\.sg$/;
      if (!emailRegex.test(this.email)) {
        this.emailError = 'Please enter a valid SMU email format.';
        return false;
      }
      this.emailError = '';
      return true;
    },

    validatePassword() {
      if (!this.password) {
        this.passwordError = 'Password is required.';
        return false;
      }
      if (this.password.length < 8) {
        this.passwordError = 'Password must be at least 8 characters long.';
        return false;
      }
      this.passwordError = '';
      return true;
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    checkForVerificationSuccess() {
      // Check if user came from email verification
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('verified') === 'true') {
        this.showVerificationSuccess = true;
        // Hide after 5 seconds
        setTimeout(() => {
          this.showVerificationSuccess = false;
        }, 5000);
      }
    },

    checkForLogoutSuccess() {
      if (sessionStorage.getItem('justLoggedOut') === 'true') {
        this.showLogoutSuccess = true;
        sessionStorage.removeItem('justLoggedOut');
        setTimeout(() => {
          this.showLogoutSuccess = false;
        }, 3500);
      }
    },

    handleLoginError(errorMessage, statusCode) {

      if (errorMessage === 'Invalid email or password') {

        
        const emailValid = this.email.trim() && this.email.includes('@smu.edu.sg');
        const passwordValid = this.password && this.password.length >= 8;
        
        if (!emailValid) {
          this.emailError = 'Please check your email address.';
        } else if (!passwordValid) {
          this.passwordError = 'Please check your password.';
        } else {
  
          this.passwordError = 'Incorrect password. Please try again.';
        }
      } else if (errorMessage === 'Email and password are required') {
        if (!this.email.trim()) this.emailError = 'Email is required.';
        if (!this.password) this.passwordError = 'Password is required.';
      } else if (errorMessage.toLowerCase().includes('verify') || errorMessage.toLowerCase().includes('confirmation')) {
        this.emailError = 'Please verify your email address before logging in.';
      } else {
        // Display other server errors as alerts
        alert(errorMessage);
      }
    },

    async handleLogin() {
      // Clear all previous errors
      this.emailError = '';
      this.passwordError = '';

      // Validate all fields
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();

      // If any validation fails, stop here
      if (!isEmailValid || !isPasswordValid) {
        return;
      }
      
      try {
        const response = await axiosInstance.post('/api/auth/login', {
          email: this.email.trim(),
          password: this.password
        })

        const { jwt_token, user_id, name, coins, profile_picture, dino_unlocked } = response.data

        const authStore = useAuthStore()
        authStore.login(jwt_token, { user_id, name, coins, profile_picture, dino_unlocked } )  

        // Set flag to show welcome message
        sessionStorage.setItem('justLoggedIn', 'true')
        
        this.$router.push('/home')
      } catch (error) {
        console.error('Login failed:', error)
        
        // Handle specific server errors
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          const statusCode = error.response.status;
          
          // Use enhanced error handling method
          this.handleLoginError(errorMessage, statusCode);
        } else {
          alert('Login failed. Please check your credentials and try again.')
        }
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.forgot-password-link {
  cursor: pointer;
  color: #cecdcd;
  font-size: 0.85rem;
  transition: color 0.3s ease;
  margin-left: 236px;
  margin-top: 20px; 
}

.forgot-password-link:hover {
  color: #cccfce;
  text-decoration-line: underline;
}


.login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 60px;
}

.login-left {
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.login-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/Stark.png') no-repeat;
  background-size: cover;
  background-position: center;
  opacity: 0.07;
  z-index: 0;
}

.left-content {
  text-align: center;
  padding: 2rem;
  max-width: 500px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.welcome {
  background: linear-gradient(135deg, #0a2e23 0%, #0d3d31 50%, #16a34a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 1.2rem;
  color: #374151;
  line-height: 1.6;
  font-weight: 400;
  margin-bottom: 1rem;
}

.tagline-continued {
  font-size: 1.2rem;
  background: linear-gradient(135deg, #0d3d31 0%, #16a34a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.6;
  font-weight: 600;
  display: block;
  margin-top: 1rem;
}

.login-right {
  background: linear-gradient(135deg, #0a2e23 0%, #0d3d31 30%, #0f5132 70%, #16a34a 100%);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.login-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.right-content {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.logo {
  color: white;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.8rem;
  letter-spacing: 0.1em;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.subheading {
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 400;
  opacity: 0.9;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-fields label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-left: 0.5rem;
}

.form-fields input {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  outline: none;
  font-size: 0.9rem;
  border: 2px solid transparent;
  width: 100%;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-fields input::placeholder {
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease;
}

.form-fields input:focus {
  outline: none;
  border-color: #148b53;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(20, 139, 83, 0.2);
}

.form-fields input:focus::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.form-fields input.input-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.password-input-container {
  position: relative;
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 38%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.eye-icon {
  width: 18px;
  height: 18px;
}

.verification-success {
  margin-top: 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  animation: fadeIn 0.5s ease-out;
}

.verification-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.verification-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-btn {
  margin-top: 0.8rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #059669 0%, #16a34a 50%, #22c55e 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.5);
  background: linear-gradient(135deg, #047857 0%, #059669 50%, #16a34a 100%);
}

.login-btn:active {
  transform: translateY(0);
}

.signup-prompt {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
  opacity: 0.8;
}

.signup-prompt a {
  color: #4ade80;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-prompt a:hover {
  color: #22c55e;
  text-decoration: underline;
}

.error-msg {
  color: #fca5a5;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.error-msg.show {
  opacity: 1;
  transform: translateY(0);
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

/* Responsive design */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-left, .login-right {
    flex: none;
    height: 50%;
  }
  
  .welcome {
    font-size: 2rem;
  }
  
  .tagline {
    font-size: 1rem;
  }
  
  .logo {
    font-size: 2rem;
  }
  
  .right-content {
    padding: 1.5rem;
  }
  
  .left-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .welcome {
    font-size: 1.8rem;
  }
  
  .tagline {
    font-size: 0.9rem;
  }
  
  .logo {
    font-size: 1.8rem;
  }
  
  .subheading {
    font-size: 1rem;
  }
  
  .form-fields input {
    padding: 0.7rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .login-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>

