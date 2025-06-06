<template>
    <!-- parent -->
    <div class="login-container">
      <!-- child 1 -->
      <div class="login-left">
          <h2 class="welcome"> WELCOME BACK</h2>
          <p class="tagline">
            from koufu straight to your favourite <br />
            study spot — we gotchu <br />
            connecting hungry students alike, <br />
            smunch is the way to go <br />
             <br /><br />
             <br /><br />
             <br /><br />
             <br /><br />
            skip the queue. get your food delivered. <br />
             by students, for students.
            <br />
            
          </p>
        </div>


      <!-- child 2 -->
      <div class="login-right">
        <h1 class="logo"> SMUNCH </h1>
        <h2 class="subheading">Login with your SMU email!</h2>

        
        <form @submit.prevent="handleLogin" class="form-fields">
            <label for="email">Email</label>
            <input 
                id="email" 
                v-model="email" 
                type="text" 
                :class="{ 'input-error': emailError }"
                placeholder="Enter your smu email" required />

            <span v-if="emailError" class="error-msg">{{ emailError }}</span>

            <label for="password">Password</label>
            <input 
                id="password" 
                v-model="password" 
                type="password" 
                placeholder="Enter your password" required />

            <button type="submit">log in</button>
        </form>
        <p class="signup-prompt">
          don't have an account? <a href="#">sign up</a> now!
        </p>
      </div>
      </div>
</template>


<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: ''
    };
  },
  methods: {
    handleLogin() {
      if (!this.email.includes('@')) {
        this.emailError = "Please enter a valid smu email address.";
        return;
      }

      this.emailError = '';
      // continue login logic...
    }
  }
};
</script>




<style scoped>

.login-container {
  height: 100vh;
  width: 100vw;
  font-family: inter;
  display: flex;
  flex-direction: row;
  /* not needed because children occupy full width justify-content: center; */
}


.login-left {
  background-image: url('/bird.jpg');
  background-repeat: no-repeat;       /* stops it from repeating */
  background-size: cover;             /* stretches to cover entire area */
  background-position: center;        /* centers the image */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 300px;
}


.login-right {
  background-color: #0d3d31;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}


.logo {
  color: white;
  font-size: 6rem;
  font-weight: bold;
  margin-top: -30px;
  margin-bottom: 230px;
}

.welcome {
    color: white;
    font-size: 5rem;
    font-weight: bold;
    margin-top: 8px;
    margin-right: 200px;
    margin-left: 120px;
    justify-content: center;
    align-items: center;
}

.tagline {
  font-size: 3.4rem;
  color: white;
  line-height: 1.5;
  
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}


.subheading {
  font-size: 3.2rem;
  text-align: center;
  width: 100%;
  font-family: inter;
  margin-bottom: 790px;
  margin-top: -176px;
  
}

/* edits for the fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 15px; /* controls space btwn the fields */
  margin-top: -650px; /* move form upwards */
  width: 750px;
}

.form-fields label {
  font-size: 25px;
  color: white;
  margin-bottom: -15px;
  margin-left: 10px;
}

.form-fields input {
  padding: 24px;
  border-radius: 40px;
  outline: none;
  font-size: 23px;
  border: none;
  box-shadow: 9px 9px 10px rgba(40, 47, 46, 0.5);
}

/* on a click, enter your xx appears */
input::placeholder {
  color: transparent;
  transition: color 0.3s ease;
  border: none;
}

input:focus::placeholder {
  color: #645d5d; 
  border: none;
}


input:hover {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8); /* white glow */
}

button {
  margin-top: 59px;
  padding: 10px;
  background-color: #148b53;
  color: white;
  border: none;
  border-radius: 19px;
  height: 80px;
  font-size:31px;
  font-weight: bold;
}

button:hover {
    box-shadow: 9px 9px 10px rgba(40, 47, 46, 0.5);
}

.signup-prompt {
  margin-top: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
}

.signup-prompt a {
  color: #c4f0e5;
  text-decoration: underline;
}

.error-msg {
    margin-left: 460px;
    color: rgb(220, 61, 61);
}
</style>

