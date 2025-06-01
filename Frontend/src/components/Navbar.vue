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
    return {}
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
      <router-link to="/orders">order</router-link> 
      <router-link to="/runners">run</router-link>
      <router-link to="/home">home</router-link>
    </div>

  </nav>
</template>


<style scoped>
/* styles for the whole nav bar box */
.navbar-box {
  display: flex;                      
  justify-content: space-between;   
  align-items: center;               
  height: 60px;                     
  padding: 0 30px;                   
  border-bottom: 2px solid #eee;    
  background-color: #17956b;;            
  font-family: sans-serif;          
  font-size: 16px;                  
  position: fixed;                   
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;                      
}


/* left side: brand */
.navbar-left {
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;             
  color: #ffffff;       
}

/* left side: brand */
.navbar-left a {
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;             
  color: #ffffff;    
  text-decoration: none;   
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
}


  /* margin: 0 12px;       horizontal space between links */


.navbar-center a:hover {
  color: #938986;                  /* grey on hover */
}

/* 🎒 right side: profile */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* bell icon */
.bell {
  width: 24px;
  height: 24px;
}

</style>