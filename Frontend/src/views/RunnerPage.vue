<template>
  <div class="page no-scroll">
    <div class="content">
      <img src="/dinoPawPrints.png" alt="Dino Paw Prints" class="dino-paw-prints" />
      <h2 class="coming-soon">coming soon!</h2>
      <p class="feature-message">This feature is cooking up some serious smunch magic. <br> Stay tuned — it's going to be wild</p>
    </div>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.content {
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  position: relative;
}

.dino-paw-prints {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: auto;
  z-index: 10;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  opacity: 0.2;
  animation: pawPrintsGlow 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pawPrintsGlow {
  0%, 100% {
    opacity: 0.02;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.coming-soon {
  font-size: 5rem;
  font-weight: bold;
  color: #0d3d31;
  margin-bottom: 1.5rem;
  transform: none;
  position: relative;
  z-index: 5;
}

.feature-message {
  font-style: italic;
  font-size: 1.2rem;
  font-weight: 600;
  color: #0d3d31;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
  letter-spacing: 0.02em;
  position: relative;
  z-index: 5;
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