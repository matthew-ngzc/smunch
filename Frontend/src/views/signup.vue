<template>
  <div class="signup-container">
    <!-- Success Notification -->
    <div v-if="showSuccessNotification" class="success-notification">
      <div class="notification-content">
        <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <div class="notification-text">
          <h4>Account Created Successfully!</h4>
          <p>Please check your email and verify your account before logging in.</p>
        </div>
        <button @click="hideNotification" class="close-btn">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Left: White -->
    <div class="signup-left">
      <div class="left-content">
        <h2 class="welcome">Sign up now!</h2>
        <p class="tagline">
          <!-- Lazy to walk to your favourite store?<br />
          — Don't worry, we gotchu.<br /><br />
          Skip the walk and ditch the queue.<br />
          We'll bring your meal right to you.<br />
          Here at SMUNCH, that's what we do.<br /><br /> -->
          Too lazy to walk? Your cravings can wait —<br />
          We’ll fetch your meal, you just hydrate.<br /><br />

          Skip the queue, avoid the heat,<br />
          Get your favourite bites without leaving your seat.<br /><br />

          No fuss, no rush, no lunchtime race —
          SMUNCH brings your food, straight to your place.

          <span class="tagline-continued">By students, for students.</span>
        </p>
      </div>
    </div>

    <!-- Right: Green -->
    <div class="signup-right">
      <div class="right-content">
        <h1 class="logo">SMUNCH</h1>
        <h2 class="subheading">Sign Up with your SMU email!</h2>

        <form @submit.prevent="handleSignup" class="form-fields">
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
            <label for="name">Name</label>
            <input 
              id="name" 
              v-model="name" 
              type="text" 
              :class="{ 'input-error': nameError }"
              placeholder="Enter your name" 
              required 
            />
            <span :class="['error-msg', { show: nameError }]">{{ nameError }}</span>
          </div>

          <div class="input-group">
            <label for="phone">Phone Number</label>
            <input 
              id="phone" 
              v-model="phoneNo" 
              type="text" 
              :class="{ 'input-error': phoneError }"
              placeholder="Enter your phone number" 
              required 
            />
            <span :class="['error-msg', { show: phoneError }]">{{ phoneError }}</span>
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
            </div>
            <span :class="['error-msg', { show: passwordError }]">{{ passwordError }}</span>
          </div>
          
          <button type="submit" class="signup-btn">
            <span>Sign Up</span>
          </button>
        </form>

        <p class="login-prompt">
          Have an account? <router-link to="/login">Log in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/utility/axiosInstance'

export default {
  data() {
    return {
      email: '',
      name: '',
      phoneNo: '',
      password: '',
      emailError: '',
      nameError: '',
      phoneError: '',
      passwordError: '',
      showPassword: false,
      showSuccessNotification: false
    };
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

    validateName() {
      if (!this.name.trim()) {
        this.nameError = 'Name is required.';
        return false;
      }
      if (this.name.trim().length < 2) {
        this.nameError = 'Name must be at least 2 characters long.';
        return false;
      }
      if (this.name.trim().length > 50) {
        this.nameError = 'Name must be less than 50 characters.';
        return false;
      }
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (!nameRegex.test(this.name.trim())) {
        this.nameError = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
        return false;
      }
      this.nameError = '';
      return true;
    },

    validatePhone() {
      if (!this.phoneNo.trim()) {
        this.phoneError = 'Phone number is required.';
        return false;
      }
      // Remove spaces and dashes for validation
      const cleanPhone = this.phoneNo.replace(/[\s-]/g, '');
      
      // Singapore phone number validation (8 digits starting with 6, 8, or 9)
      const sgPhoneRegex = /^[689]\d{7}$/;
      if (!sgPhoneRegex.test(cleanPhone)) {
        this.phoneError = 'Please enter a valid Singapore phone number (8 digits starting with 6, 8, or 9).';
        return false;
      }
      this.phoneError = '';
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
      if (this.password.length > 128) {
        this.passwordError = 'Password must be less than 128 characters.';
        return false;
      }
      if (!/(?=.*[a-z])/.test(this.password)) {
        this.passwordError = 'Password must contain at least one lowercase letter.';
        return false;
      }
      if (!/(?=.*[A-Z])/.test(this.password)) {
        this.passwordError = 'Password must contain at least one uppercase letter.';
        return false;
      }
      if (!/(?=.*\d)/.test(this.password)) {
        this.passwordError = 'Password must contain at least one number.';
        return false;
      }
      if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(this.password)) {
        this.passwordError = 'Password must contain at least one special character.';
        return false;
      }
      this.passwordError = '';
      return true;
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    showNotification() {
      this.showSuccessNotification = true;
      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.hideNotification();
      }, 5000);
    },

    hideNotification() {
      this.showSuccessNotification = false;
    },

    async handleSignup() {
      // Clear all previous errors
      this.emailError = '';
      this.nameError = '';
      this.phoneError = '';
      this.passwordError = '';

      // Validate all fields
      const isEmailValid = this.validateEmail();
      const isNameValid = this.validateName();
      const isPhoneValid = this.validatePhone();
      const isPasswordValid = this.validatePassword();

      // If any validation fails, stop here
      if (!isEmailValid || !isNameValid || !isPhoneValid || !isPasswordValid) {
        return;
      }

      try {
        const response = await axiosInstance.post('/api/auth/signup', {
          email: this.email.trim(),
          name: this.name.trim(),
          phoneNo: this.phoneNo.replace(/[\s-]/g, ''), // Clean phone number
          password: this.password
        })

        console.log('Sign up successful!');
        this.showNotification();
        // Navigate to login after a short delay to show the notification
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);

      } catch (error) {
        console.error('Signup failed:', error)
        
        // Handle specific server errors
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          
          // Map server errors to specific fields
          if (errorMessage.toLowerCase().includes('email')) {
            this.emailError = errorMessage;
          } else if (errorMessage.toLowerCase().includes('phone')) {
            this.phoneError = errorMessage;
          } else if (errorMessage.toLowerCase().includes('password')) {
            this.passwordError = errorMessage;
          } else if (errorMessage.toLowerCase().includes('name')) {
            this.nameError = errorMessage;
          } else {
            alert(errorMessage);
          }
        } else {
          alert('Signup failed. Please check your input or try again later.')
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

.signup-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 60px;
}

/* LEFT: white half */
.signup-left {
  flex: 1;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.signup-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('dinoSMUNCHING.png') no-repeat;
  background-size: cover;
  background-position: center;
  opacity: 0.07;
  z-index: 0;
}

.left-content {
  text-align: left;
  padding: 2rem;
  max-width: 500px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

.welcome {
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0a2e23 0%, #0d3d31 50%, #16a34a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 1.2rem;
  color: #374151;
  line-height: 1.6;
  font-weight: 400;
}

.tagline-continued {
  display: block;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #0d3d31 0%, #16a34a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 1.5rem;
  font-weight: 600;
}

/* RIGHT: green half */
.signup-right {
  flex: 1;
  background: linear-gradient(135deg, #0a2e23 0%, #0d3d31 30%, #0f5132 70%, #16a34a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.signup-right::before {
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

/* Form styling */
.form-fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
  top: 50%;
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

.success-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
  animation: slideDown 0.5s ease-out;
  max-width: 500px;
  width: 90%;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.success-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-text {
  flex: 1;
}

.notification-text h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.notification-text p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.4;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.close-btn svg {
  width: 16px;
  height: 16px;
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

.signup-btn {
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

.signup-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.signup-btn:hover::before {
  left: 100%;
}

.signup-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.5);
  background: linear-gradient(135deg, #047857 0%, #059669 50%, #16a34a 100%);
}

.signup-btn:active {
  transform: translateY(0);
}

/* Other */
.login-prompt {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
  opacity: 0.8;
}

.login-prompt a {
  color: #4ade80;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-prompt a:hover {
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
  .signup-container {
    flex-direction: column;
  }
  
  .signup-left, .signup-right {
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
  
  .signup-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>