<!-- 
 REIWEN : 
    This is the root and first component that gets rendered by main.ts 
    Think of it like the master page -- every viewpage rendered through routing will be inserted in App.vue 

    What should be inside here?
    - Navbar component (because we want to use it in every page)
    - <RouterView /> 
    - Reusable global UI elements like Footers, Toasts and Modals 
    - Global error handlers / loading states 
 -->

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container"> 
    <header>
      <nav>
        <!-- REIWEN: this is one way to route, aka route by path -->
        <RouterLink to="/">SMUNCH</RouterLink>
        <!-- REIWEN: this is another way to route, aka by name -->
        <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      </nav>
    </header>
  
    <main>
      <!-- REIWEN: This is where our route components will be dynamically injected -->
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>
/* Full-page layout */
html, body, .app-container {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Keep header fixed at top */
header {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Nav layout */
nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1.2rem 0;
}

/* Nav links */
nav a {
  font-size: 14px;
  font-weight: 500;
  color: #444;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

nav a:hover {
  background-color: #f0f0f0;
  color: #007bff;
}

nav a.router-link-exact-active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

/* Add spacing for page content */
main {
  max-width: 960px;
  margin: 2rem auto;
  padding: 1rem;
}

</style>



