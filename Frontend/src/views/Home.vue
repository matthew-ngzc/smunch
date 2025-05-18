<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    // No reactive state or methods needed for now
    return {}
  }
})
</script>

<template>
  <div class="home">
    <h1>Welcome to Homepage</h1>
    <p>Are you a customer? or Are you a runner?</p>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}
</style>