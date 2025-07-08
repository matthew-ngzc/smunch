<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'

// reactive to user 
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

const logout = () => {
  console.log('Logging out...')
  
}
</script>



<template>

  <nav class="navbar-box">
    <div class="navbar-left">
      
      <router-link to="/" class = "smunch"> smunch</router-link>
    </div>

 
    <!-- nav links that switch between pages -->
    <div class="navbar-center">
      <router-link to="/home">home</router-link>
      <router-link to="/order">order</router-link> 
      <router-link to="/run">run</router-link>
    </div>

    <div class="navbar-right">
        <!-- bell icon -->
        <!-- <img :src="bellIcon" class="bell" alt="bell" /> -->

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
          <li @click="logout">log out</li>
          <li>view past orders</li>
          <li>view active orders</li>
          <li>help</li>
        </ul>
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
  color: black;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  width: 180px;
  z-index: 100;
}

.profile-menu .close {
  text-align: right;
  cursor: pointer;
  font-weight: bold;
}

.profile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-menu li {
  margin: 10px 0;
  cursor: pointer;
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
  width: 30px;
  height: 30px;
}

.profile-menu hr {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #888;
}


</style>

