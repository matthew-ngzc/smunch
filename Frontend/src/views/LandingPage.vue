<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LandingPage',
  setup() {
    // No reactive state or logic needed at the moment
    return {}
  }
})
</script>

<template>
  <div class="home">
    <h1>Welcome to SMUNCH</h1>
    <p>This is the landing page.</p>
    <p>blah blah blah</p>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}
</style>
