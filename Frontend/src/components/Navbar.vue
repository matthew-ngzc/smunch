<script setup>
import { ref, onMounted, onBeforeUnmount, computed  } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import coins from '@/assets/smunch_coin.jpg'
import axiosInstance from '@/utility/axiosInstance.js'
import { storeToRefs } from 'pinia';

const auth = useAuthStore()
const router = useRouter()
const { profilePicture } = storeToRefs(auth)

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
            <img v-if="profilePicture" :src="profilePicture" alt="Profile Picture" class="profile-pic" />
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="23px" height="23px" viewBox="0 0 24 24">
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
        <!-- menu-header -->
        <div class="menu-header">
          <div class="dropdown-user-info">
            <div class="dropdown-user-details">
              <div class="dropdown-user-name"> hi, {{ auth.userName || 'User' }}!</div>
            </div>
          </div>

          <div class="close" @click.stop="closeMenu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>


      <hr />

      <ul>
        <li><router-link to="/profile">View Profile</router-link></li>
        <li> <router-link to="/activeOrders">Active orders</router-link> </li>
        <li> <router-link to="/pastOrders">Past orders</router-link> </li>
        <li> <router-link to="/faq">FAQ</router-link> </li>
        <li> <router-link to="/contact">Contact Us</router-link> </li>
        <li @click="logout">  Log out</li>
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
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.profile-wrapper:hover {
  background: rgba(255, 255, 255, 0.1);
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

.profile-pic {
  width: 37px;
  height: 37px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0d3d31;
}

.profile-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background: white;
  color: rgb(60, 58, 58);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  width: 220px;
  z-index: 100;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.dropdown-user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-user-name {
  font-weight: 600;
  font-size: 16px;
  color: #134e4a;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close:hover {
  background: #f0f0f0;
  color: #333;
}

.msg {
  font-size: 16px;
  color: #0d3d31;
  font-weight: bold;
  margin-top: 2px;
  margin-left: 5px;
}


.profile-menu hr {
  margin: 12px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}

.profile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-menu li {
  border-radius: 8px;
  transition: background-color 0.2s ease;
  cursor: pointer;
  margin: 2px 0;
}

.profile-menu li:hover {
  background-color: #f8f9fa;
}

.profile-menu li a {
  all: unset;
  display: block;
  padding: 10px 12px;
  width: 100%;
  color: #134e4a;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
}

.profile-menu li:last-child {
  margin-top: 8px;
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
}

.profile-menu li:last-child a {
  color: #dc3545;
  font-weight: 600;
}

.profile-menu li:last-child:hover {
  background-color: #fff5f5;
}

.profile-menu hr {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
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

/* Responsive design */
@media (max-width: 768px) {
  .profile-menu {
    width: 200px;
    right: 10px;
  }
  

  
  .dropdown-user-name {
    font-size: 13px;
  }
}

</style>

