<template>
  <div class="page no-scroll">
    <h2 class="coming-soon">coming soon!</h2>
  </div>
</template>

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

<style scoped>
.page.no-scroll {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.coming-soon {
  font-size: 5rem;
  font-weight: bold;
  color: #0d3d31;
  transform: none;
}
</style>