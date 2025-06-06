<template>
    <!-- parent -->
    <div class="login-container">
      <!-- child 1 -->
      <div class="login-left">
          <h2 class="welcome"> sign up now!</h2>
          <p class="tagline">
                lazy to walk to your favourite store? <br />
           —dont worry we gotchu.
           <br /><br /> 
           skip the walk and ditch the queue. <br />
           we'll bring your meal right to you. <br />
           here at smunch, that's what we do. <br />   
             <br /><br />
             <br /><br />
             <br /><br />
             </p>
          <p class="tagline-continued"> 
             by students, for students.
          </p>
        </div>


      <!-- child 2 -->
      <div class="login-right">
        <h1 class="logo"> SMUNCH </h1>
        <h2 class="subheading">Sign Up with your SMU email!</h2>

        
        <form @submit.prevent="handleLogin" class="form-fields">
            <label for="email">Email</label>
            <input 
                id="email" 
                v-model="email" 
                type="text" 
                :class="{ 'input-error': emailError }"
                placeholder="Enter your smu email" required />

            <span :class="['error-msg', { show: emailError }]">{{ emailError || '' }}</span>


            <label for="password">Password</label>
            <input 
                id="password" 
                v-model="password" 
                type="password" 
                placeholder="Enter your password" required />

            <label for="confirm-password">Confirm Password</label>

            <input 
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm your password" required />

            <span :class="['error-msg', { show: passwordError }]">{{ passwordError || '' }}</span>


            <button type="submit">sign up</button>
        </form>
        <p class="login-prompt">
          have an account? 
          <router-link to="/login">log in</router-link>
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
      emailError: '',
      confirmPassword: '',
      passwordError: ''
    };
  },
  methods: {
    handleLogin() {
  // validate email
  if (!this.email.includes('@smu.edu.sg')) {
    this.emailError = "Please enter a valid smu email address.";
    return;
  } else {
    this.emailError = '';
  }

  // validate password match
  if (this.password !== this.confirmPassword) {
    this.passwordError = "Passwords do not match.";
    return;
  } else {
    this.passwordError = '';
  }

  // continue sign up logic here
  console.log('sign up successful!');
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
  background-color: white;
  /* background-image: url('/bird.jpg'); */
  background-image: url('/dinoburger2.jpg');
  background-repeat: no-repeat;       /* stops it from repeating */
  /* background-size: cover;             /* stretches to cover entire area */
  background-position:  30px 630px;     /* 30px from left, 50px from top */
  background-size: 1000px auto;  /* 150px wide, height auto-adjusts */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 300px;
}


.login-right {
  background-color: #0d3d31;
  flex: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}


.logo {
  color: white;
  font-size: 3.5rem;
  font-weight: bold;
  margin-top: -180px;
  margin-bottom: 230px;
  margin-left: 130px;
}

.welcome {
    color: #0d3d31;
    font-size: 3.2rem;
    font-weight: bold;
    margin-top: -130px;
    margin-right: 200px;
    margin-left: 120px;
    justify-content: center;
    align-items: center;
    
}

.tagline {
  font-size: 2.3rem;
  color: #0d3d31;
  line-height: 1.5;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
  margin-right: 160px;
}

.tagline-continued {
  font-size: 2.3rem;
  color: black;
  line-height: 1.5;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
  margin-left: 450px;
}



.subheading {
  font-size: 2.5rem;
  text-align: center;
  justify-content: center;
  width: 100%;
  font-family: inter;
  margin-bottom: 790px;
  margin-top: -176px;
  margin-left: 160px;
  
}

/* edits for the fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 29px; /* controls space btwn the fields */
  margin-top: -690px; /* move form upwards */
  width: 600px;
}

.form-fields label {
  font-size: 26px;
  color: white;
  margin-bottom: -15px;
  margin-left: 10px;
}

.form-fields input {
  padding: 24px;
  border-radius: 40px;
  outline: none;
  font-size: 25px;
  border: none;
  box-shadow: 9px 9px 10px rgba(40, 47, 46, 0.5);
  width: 760px;
}

/* on a click, enter your xx appears */
input::placeholder {
  color: transparent;
  transition: color 0.3s ease;
  border: none;
  font-size: 25px;
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
  padding: 4px;
  background-color: #148b53;
  color: white;
  border: none;
  border-radius: 23px;
  height: 82px;
  width: 760px;;
  font-size:30px;
  font-weight: bold;
}

button:hover {
    box-shadow: 9px 9px 10px rgba(40, 47, 46, 0.5);
}


.login-prompt {
  margin-top: 1.5rem;
  font-size: 1.7rem;
  text-align: center;
  margin-left: 170px;
}

.login-prompt a {
  color: #c4f0e5;
  text-decoration: underline;
}

.error-msg {
  color: rgb(213, 58, 58);
  font-size: 20px;
  visibility: hidden;     /* hide without collapsing space */
  margin-left: 200px;
}

.error-msg.show {
  visibility: visible;    /* make it appear */
}


</style>



