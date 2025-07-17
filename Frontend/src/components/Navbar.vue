<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import coins from '@/assets/smunch_coin.jpg'
import axiosInstance from '@/utility/axiosInstance.js'

const auth = useAuthStore()
const router = useRouter()

// handling dropdown closure 
const isOpen = ref(false)

const toggleMenu = (e) => {
  e.stopPropagation()
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

// define what happens when user clicks out 
const handleClickOutside = (e) => {
  if (!e.target.closest('.profile-wrapper')) {
    closeMenu()
  }
}

// to check user 
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const logout = async () => {
  try {
    // Save current coins and dino unlock status to backend before logging out
    await axiosInstance.put('/api/users/collections', {
      coins: auth.coins,
      dinoUnlocked: auth.dinoUnlocked
    });
  } catch (error) {
    console.warn('Failed to save collections data before logout:', error);
    // Continue with logout even if API call fails
  }
  
  auth.logout();
  sessionStorage.setItem('justLoggedOut', 'true');
  closeMenu();
  router.push({ path: '/', query: { logout: Date.now() } }); // Always triggers route change
}
</script>



<template>

  <nav class="navbar-box">
    <div class="navbar-left">
      
      <router-link to="/" class = "smunch"> smunch</router-link>
    </div>

 
    <!-- nav links that switch between pages -->
    <div class="navbar-center" v-if="auth.token">
      <router-link to="/home">home</router-link>
      <router-link to="/order">order</router-link> 
      <router-link to="/run">run</router-link>
      <router-link to="/game">play</router-link>
      <router-link to="/collections">collections</router-link>
    </div>

    <div class="navbar-right" v-if="auth.token">
        <!-- coins display -->
        <div class="coins-display">
          <div class="coin-icon">
            <img src="../assets/smunch_coin.jpg" alt="Smunch Coin" class="coin-image" />
          </div>
          <span class="coins-count">{{ auth.coins }}</span>
        </div>

         <div class="profile-wrapper" @click="toggleMenu">
          <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="23px" height="23px" viewBox="0 0 24 24">
              <g fill="none" stroke="#0d3d31" stroke-linecap="round" stroke-width="2">
                <path d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1"> </path>
                <path d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z"> </path>
              </g>
            </svg>
          </div>
        </div>

    </div>

    <div class="navbar-right" v-else>
      <router-link to="/login" class="auth-link">Login</router-link>
      <router-link to="/signup" class="auth-link">Sign Up</router-link>
    </div>

    <!-- dropdown -->
      <div v-if="isOpen" class="profile-menu" ref="dropdown">
        <div class="menu-header">
          <div class="dropdown-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none" stroke="#0d3d31" stroke-linecap="round" stroke-width="2">
                <path d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1"/>
                <path d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z"/>
              </g>
            </svg>
          </div>
          <div class="close" @click.stop="closeMenu">X</div>
        </div>

      <hr />

      <ul>
        <li><router-link to="/profile">View Profile</router-link></li>
        <li @click="logout">  Log out</li>
        <li> <router-link to="/activeOrders">Active orders</router-link> </li>
        <li> <router-link to="/pastOrders">Past orders</router-link> </li>
        <li> <router-link to="/help">Help</router-link> </li>
      </ul>
      </div>

  </nav>
</template>


<style scoped>


/* navbar hidden by default */
.navbar-box {
  background-color: #0d3d31;
  padding: 0 30px;
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

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  
}

/* coins display */
.coins-display {
  display: flex;
  align-items: center;
  gap: 1px;
  background-color: white;
  padding: 3px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.coin-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -5px 0;
}

.coin-image {
  width: 40px; /* Larger coin */
  height: 40px; /* Larger coin */
  object-fit: contain;
}

.coins-count {
  font-weight: bold;
  color: #000;
  font-size: 18px;
}

/* bell icon */
.bell {
  width: 3rem;
  height: 3rem;
}

.profile-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.profile-wrapper svg {
  width: 34px;
  height: 34px;
  object-fit: contain;      /* keeps aspect ratio */
}

.icon-circle {
  width: 37px;
  height: 37px;
  background-color: white; /* or any color */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  /* optional shadow or border */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}

.profile-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background: white;
  color: rgb(60, 58, 58);
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.2);
  width: 220px;
  z-index: 100;
  padding: 12px 16px; /* ✅ uniform internal spacing */
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-icon-circle {
  width: 36px;
  height: 36px;
  background-color: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-icon-circle svg {
  width: 24px;
  height: 24px;
}

.profile-menu hr {
  margin: 12px 0;
  border: none;
  border-top: 1px solid #ccc;
}

.profile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-menu li {
  border-radius: 6px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  padding: 4px 0; /* ✅ vertical padding only */
}

.profile-menu li:hover {
  background-color: #f2f2f2;
}

.profile-menu li a {
  all: unset;
  display: block;
  padding-left: 4px; /* ✅ light indent */
  width: 100%;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.profile-menu hr {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #888;
}

.auth-link {
  color: white;
  font-weight: bold;
  text-decoration: none;
  font-size: 16px;
  background: transparent;
}

.auth-link:hover {
  text-shadow: 4px 4px 5px #a9b5cd;
}

</style>

