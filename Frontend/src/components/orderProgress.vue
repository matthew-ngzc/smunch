<script setup>
import { readonly, computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const data = readonly(
  /** @type {{ steps: string[]; currentStep: number; activeColor: string; passiveColor: string }} */
  props.data
)

const dinoVideos = [
  'dinoCashier.MP4',  // awaiting payment
  'dinoTime.MP4',  // awaiting verification
  'dinoMoney.MP4',   // payment confirmed
  'dinoCooking.MP4',   // preparing
  'dinoMap.MP4',       // collected
  'dinoNotebook.MP4',  // delivered
  'dinoHappy.MP4'      // completed
] 


const cssStyle = computed(() => ({
  '--active-color': data.activeColor,
  '--passive-color': data.passiveColor
}))
</script>

<template>
  <div class="steps-container" :style="cssStyle">
    <ul class="steps-list">
      <li
        v-for="(step, index) in data.steps"
        :key="index"
        class="step"
        :class="{
          'step-active': index === data.currentStep - 1,
          'step-done': index < data.currentStep - 1
        }"
      >
        <div class="step-content">
          <!-- only play video if active step -->
         <!-- active: play mp4 -->
        <video
          v-if="index === data.currentStep - 1"
          :src="`/${dinoVideos[index]}`"
          autoplay
          loop
          muted
          playsinline
          class="step-dino"
        />

        <!-- inactive: show still image -->
        <img
          v-else
          :src="`/${dinoVideos[index].replace('.MP4', '.png')}`"
          class="step-dino"
        />

          <div class="step-label">{{ step }}</div>
        </div>
        <!-- line before the bubble -->
<div
  class="step-line step-line-left"
  :class="{ 'step-done': index > 0 && index <= data.currentStep - 1 }"
/>

<!-- line after the bubble -->
<div
  class="step-line step-line-right"
  :class="{ 'step-done': index < data.steps.length - 1 && index < data.currentStep - 1 }"
/>

      </li>
    </ul>
  </div>
</template>

<style scoped>
.steps-container {
  margin: 30px auto 20px;
  width: 100%;
  max-width: 1100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.steps-list {
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0 40px;
  margin: 0;
  position: relative;
  width: 100%;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  text-align: center;
  flex: 1;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.step-dino {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  object-fit: contain;
  filter: grayscale(1);
  transition: all 0.3s ease;
  background-color: white;
}

.step-active .step-dino,
.step-done .step-dino {
  filter: none;
  transform: scale(1.1);
}

.step-label {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--passive-color);
  background-color: white;
  padding: 2px 6px;
  border-radius: 6px;
}

.step-active .step-label,
.step-done .step-label {
  color: var(--active-color);
  font-weight: bold;
}

.step-line-left,
.step-line-right {
  position: absolute;
  top: 32px;
  width: 50%;
  height: 4px;
  background-color: var(--passive-color);
  z-index: 0;
  border-radius: 2px;
}

.step-line-left {
  left: 0;
  transform: translateX(-100%);
}

.step-line-right {
  right: 0;
  transform: translateX(100%);
}

.step-line-left.step-done,
.step-line-right.step-done {
  background-color: var(--active-color);
}

.step:first-child .step-line-left {
  display: none;
}

.step:last-child .step-line-right {
  display: none;
}

.step-done .step-line {
  background-color: var(--active-color);
}
</style>
