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
  <div>
    <nav>
      <!-- REIWEN: this is one way to route, aka route by path -->
      <RouterLink to="/">Home</RouterLink>
      <!-- REIWEN: this is another way to route, aka by name -->
      <RouterLink :to="{ name: 'aboutView' }">About</RouterLink>
    </nav>
  </div>
  <!-- REIWEN: This is where our route components will be dynamically injected -->
  <RouterView/>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>
