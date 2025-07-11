<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Runner',
  setup() {
    // No reactive logic yet, but setup function is ready
    return {}
  }
})
</script>

<template>
  <div class="page">
    <h2 class="coming-soon">coming soon!</h2>
  </div>
</template>

<style scoped>

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.coming-soon {
  font-size: 5rem;
  font-weight: bold;
  transform: translateX(50px); 
  color: #0d3d31;
}

</style>