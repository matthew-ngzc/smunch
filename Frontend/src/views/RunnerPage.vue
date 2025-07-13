<template>
  <div class="page no-scroll">
    <h2 class="coming-soon">coming soon!</h2>
    <img src="/dinoRun.png" alt="Running Dino" class="dino-run" />
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
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
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
.dino-run {
  position: fixed;
  left: 0;
  bottom: 18px;
  width: 110px;
  height: auto;
  z-index: 200;
  animation: runAcross 3.5s linear infinite;
  pointer-events: none;
}
@keyframes runAcross {
  0% {
    left: -120px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 100vw;
    opacity: 0;
  }
}
@media (max-width: 600px) {
  .dino-run {
    width: 60px;
    bottom: 8px;
  }
}
</style>