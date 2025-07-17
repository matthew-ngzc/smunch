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
          <div class="step-bubble">{{ index + 1 }}</div>
          <div class="step-label">{{ step }}</div>
        </div>
        <div class="step-line"></div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.steps-container {
  margin-top: 40px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}


.steps-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  gap: 120px;
}

.step {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  text-align: center;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.step-bubble {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: var(--passive-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: background-color .3s ease;
}

.step-label {
  margin-top: 8px;
  font-size: 16px;
  text-transform: uppercase;
  color: var(--passive-color);
  transition: color .3s ease;
}

.step-line {
  position: absolute;
  top: 18%;
  left: 102px;
  width: 140%;
  height: 4px;
  transform: translateY(-50%);
  background-color: var(--passive-color);
  z-index: 0;
  border-radius: 2px;
}

.step:last-child .step-line {
  display: none;
}

.step-done .step-line,
.step-done .step-bubble,
.step-active .step-bubble {
  background-color: var(--active-color) !important;
  color: white;
}

.step-active .step-label,
.step-done .step-label {
  color: var(--active-color);
  font-weight: bold;
}
</style>
