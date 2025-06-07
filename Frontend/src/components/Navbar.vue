<script lang="js">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import bellIcon from '@/assets/bell.png'


export default defineComponent({
  components: {
    RouterLink
  },
  setup() {
    // No reactive state or methods needed for now
    return {bellIcon}
  }
})
</script>

<template>

  <nav class="navbar-box">
    <div class="navbar-left">
      
      <router-link to="/" class = "smunch"> smunch</router-link>
    </div>

    <div class="navbar-right">
        <!-- bell icon -->
        <img :src="bellIcon" class="bell" alt="bell" />
    </div>

 
    <!-- nav links that switch between pages -->
    <div class="navbar-center">
      <router-link to="/home">home</router-link>
      <router-link to="/order">order</router-link> 
      <router-link to="/run">run</router-link>
    </div>

  </nav>
</template>


<style scoped>


/* navbar hidden by default */
.navbar-box {
  background-color: #0d3d31;
  padding: 0 30px;
  border-bottom: 2px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: sans-serif;
  font-size: 16px;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}


/* left side: brand */
.navbar-left {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;             
  color: #ffffff;  
       
}



/* left side: brand */
.navbar-left a {
  font-weight: bold;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 8px;             
  color: #ffffff;    
  text-decoration: none;  
  display: inline;
  background-color: transparent; 
}



/* edits the entire centre container, not the specific links yet  */
.navbar-center {
  position: absolute;      
  left: 50%;             
  transform: translateX(-50%);  
  display: flex;
  gap: 20px;
}

/* targets only the tags inside the container, styling the individual links inside */
.navbar-center a {
  color: white;
  font-weight: bold;
  text-decoration: none;
  font-size: 16px;
  background: transparent;
}


.navbar-center a:hover {
  text-shadow: 4px 4px 5px#a9b5cd;                  /* grey on hover */
}

/* 🎒 right side: profile */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* bell icon */
.bell {
  width: 3rem;
  height: 3rem;
}

</style>

