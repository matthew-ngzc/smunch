<template>
  <div class="login-container">
    <!-- Left: White -->
    <div class="login-left">
      <div class="left-content">
        <h2 class="welcome">sign up now!</h2>
        <p class="tagline">
          lazy to walk to your favourite store?<br />
          —dont worry we gotchu.<br /><br />
          skip the walk and ditch the queue.<br />
          we'll bring your meal right to you.<br />
          here at smunch, that's what we do.<br /><br />
          <span class="tagline-continued">by students, for students.</span>
        </p>
      </div>
    </div>

    <!-- Right: Green -->
    <div class="login-right">
      <div class="right-content">
        <h1 class="logo">SMUNCH</h1>
        <h2 class="subheading">Sign Up with your SMU email!</h2>

        <form @submit.prevent="handleLogin" class="form-fields">
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

          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <label for="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />
          <span :class="['error-msg', { show: passwordError }]">{{ passwordError }}</span>

          <button type="submit">sign up</button>
        </form>

        <p class="login-prompt">
          have an account? <router-link to="/login">log in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      emailError: '',
      passwordError: ''
    };
  },
  methods: {
    handleLogin() {
      if (!this.email.includes('@smu.edu.sg')) {
        this.emailError = 'Please enter a valid smu email address.';
        return;
      } else {
        this.emailError = '';
      }

      if (this.password !== this.confirmPassword) {
        this.passwordError = 'Passwords do not match.';
        return;
      } else {
        this.passwordError = '';
      }

      console.log('Sign up successful!');
    }
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: inter, sans-serif;
}

.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

/* LEFT: white half */
.login-left {
  flex: 1;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.left-content {
  text-align: left;
  padding: 2rem;
  max-width: 500px;
}

.welcome {
  font-size: 2.5rem;
  font-weight: bold;
  color: #0d3d31;
  margin-bottom: 1.5rem;
}
.tagline {
  font-size: 1.2rem;
  color: #0d3d31;
  line-height: 2rem;
}
.tagline-continued {
  display: block;
  font-size: 1.2rem;
  color: black;
  margin-top: 2rem;
}

/* RIGHT: green half */
.login-right {
  flex: 1;
  background-color: #0d3d31;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  overflow: hidden;
}
.right-content {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.subheading {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Form styling */
.form-fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-fields label {
  font-size: 1rem;
}
.form-fields input {
  padding: 0.9rem 1rem;
  border-radius: 30px;
  font-size: 1rem;
  border: none;
  width: 100%;
}
input::placeholder {
  color: #999;
}
input:focus::placeholder {
  color: #333;
}
button {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #148b53;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
}
button:hover {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

/* Other */
.login-prompt {
  margin-top: 1rem;
  font-size: 0.95rem;
  text-align: center;
}
.login-prompt a {
  color: #c4f0e5;
  text-decoration: underline;
}
.error-msg {
  color: rgb(213, 58, 58);
  font-size: 0.9rem;
  visibility: hidden;
}
.error-msg.show {
  visibility: visible;
}

</style>