<script>
import { RouterLink } from 'vue-router';
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