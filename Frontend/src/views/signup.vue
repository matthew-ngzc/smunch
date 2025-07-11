<template>
  <div class="signup-container">
    <!-- Left: White -->
    <div class="signup-left">
      <div class="left-content">
        <h2 class="welcome">Sign up now!</h2>
        <p class="tagline">
          Lazy to walk to your favourite store?<br />
          —Don't worry, we gotchu.<br /><br />
          Skip the walk and ditch the queue.<br />
          We'll bring your meal right to you.<br />
          Here at SMUNCH, that's what we do.<br /><br />
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
              placeholder="Enter your name" 
              required 
            />
          </div>

          <div class="input-group">
            <label for="phone">Phone Number</label>
            <input 
              id="phone" 
              v-model="phoneNo" 
              type="text" 
              placeholder="Enter your phone number" 
              required 
            />
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
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
      emailError: ''
    };
  },
  methods: {
    async handleSignup() {
      if (!this.email.includes('@smu.edu.sg')) {
        this.emailError = 'Please enter a valid SMU email address.';
        return;
      } else {
        this.emailError = '';
      }

      try {
        const response = await axiosInstance.post('/api/auth/signup', {
          email: this.email,
          name: this.name,
          phoneNo: this.phoneNo,
          password: this.password
        })

        console.log('Sign up successful!');
        alert('Sign up successful! Verify using your email and log in.')
        this.$router.push('/login')

      } catch (error) {
        console.error('Signup failed:', error)
        alert('Signup failed. Please check your input or try again later.')
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
  padding-top: 62px;
}

/* LEFT: white half */
.signup-left {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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
  background: url('/dinoburger2.jpg') no-repeat;
  background-size: cover;
  background-position: center;
  opacity: 0.1;
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
  color: #0d3d31;
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
  color: #0d3d31;
  margin-top: 1.5rem;
  font-weight: 600;
}

/* RIGHT: green half */
.signup-right {
  flex: 1;
  background: linear-gradient(135deg, #0d3d31 0%, #0f5132 100%);
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
  border-radius: 10px;
  font-size: 0.9rem;
  border: 2px solid transparent;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
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

.signup-btn {
  margin-top: 0.8rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #148b53 0%, #16a34a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
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
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(20, 139, 83, 0.4);
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