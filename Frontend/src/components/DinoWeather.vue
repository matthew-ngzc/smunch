<template>
  <div class="dino-weather">
    <img :src="dinoImg" alt="dino" class="dino-img" />
    <div class="speech-bubble">{{ bubbleText }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  raining: Boolean,
  message: String
})

const dinoImg = computed(() =>
  props.raining ? '/dinoRain.png' : '/dinoSMUNCHING.png'
)

const bubbleText = computed(() => {
  if (props.raining) {
    return "It might rain in the next hour. Stay dry and order in!";
  } else {
    return "Life's good. Let's get SMUNCHIN' !";
  }
})
</script>

<style scoped>
.dino-weather {
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  gap: 14px;
}
.dino-img {
  width: 95px;
  height: auto;
  filter: drop-shadow(0 4px 16px rgba(44,62,80,0.18));
}
.speech-bubble {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f7fa 100%);
  color: #134e4a;
  border-radius: 15px;
  padding: 10px 16px;
  font-size: 0.98rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(44,62,80,0.13);
  border: 1.5px solid #b2f7ef;
  min-width: 110px;
  max-width: 180px;
  margin-bottom: 28px;
  margin-left: 0;
  margin-right: 0;
  text-align: left;
  transition: box-shadow 0.2s;
}
.speech-bubble::before {
  content: '';
  position: absolute;
  left: -16px;
  bottom: 10px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 16px solid #f8fafc;
  filter: drop-shadow(-2px 2px 0 #b2f7ef);
}
@media (max-width: 600px) {
  .dino-weather {
    left: 6px;
    bottom: 6px;
    gap: 5px;
  }
  .dino-img {
    width: 55px;
  }
  .speech-bubble {
    font-size: 0.82rem;
    padding: 6px 9px;
    min-width: 60px;
    max-width: 100px;
    margin-bottom: 10px;
  }
  .speech-bubble::before {
    left: -8px;
    bottom: 5px;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 8px solid #f8fafc;
  }
}
</style> 