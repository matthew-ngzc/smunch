<template>
  <div class="login-container">
    <!-- Left: White with background image -->
    <div class="login-left">
      <div class="left-content">
        <h2 class="welcome">Welcome back!</h2>
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
            <span v-if="emailError" class="error-msg">{{ emailError }}</span>
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

          <button type="submit" class="login-btn">
            <span>Log In</span>
          </button>
        </form>

        <p class="signup-prompt">
          Don't have an account? 
          <router-link to="/signup">Sign up</router-link> now! 
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import axiosInstance from '@/utility/axiosInstance'

export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: ''
    };
  },
  methods: {
    async handleLogin() {
      if (!this.email.includes('@smu.edu.sg')) {
        this.emailError = "Please enter a valid SMU email address.";
        return;
      }

      this.emailError = '';
      
      try {
        const response = await axiosInstance.post('/api/auth/login', {
          email: this.email,
          password: this.password
        })
//
        console.log('Full response:', response)
        console.log('Response data:', response.data)

        const { jwt_token, user_id, name } = response.data
//
        console.log('jwt_token:', jwt_token)
        console.log('user_id:', user_id)
        console.log('name:', name)

        const authStore = useAuthStore()
        authStore.login(jwt_token, { user_id, name } )  
//
        console.log('Auth store after login:', {
          token: authStore.token,
          userId: authStore.userId,
          userName: authStore.userName
        })


        this.$router.push('/home')
      } catch (error) {
        console.error('Login failed:', error)
        alert('Invalid login. Please try again.')
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
  padding-top: 62px;
}

.login-left {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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
  background: url('/dinoburger2.jpg') no-repeat;
  background-size: cover;
  background-position: center;
  opacity: 0.15;
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
  color: #0d3d31;
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
  color: #0d3d31;
  line-height: 1.6;
  font-weight: 600;
  display: block;
  margin-top: 1rem;
}

.login-right {
  background: linear-gradient(135deg, #0d3d31 0%, #0f5132 100%);
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
  border-radius: 10px;
  outline: none;
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

.login-btn {
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
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(20, 139, 83, 0.4);
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

