<script lang="js">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

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
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <!-- SMUNCH brand -->
      <RouterLink class="navbar-brand" :to="{ name: 'landingPage' }">SMUNCH</RouterLink>

      <!-- Collapse button for small screens -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav">
          <RouterLink class="nav-link" :to="{ name: 'home' }">Home</RouterLink>
          <RouterLink class="nav-link" :to="{ name: 'orderPage' }">Order</RouterLink>
          <RouterLink class="nav-link" :to="{ name: 'runnerPage' }">Run</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<!-- scoped means this sytle only applies for this Navbar component -->
<style scoped> 
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #006948 !important ;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.navbar a {
  color: white !important; 
}

.container-fluid {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
