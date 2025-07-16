<template>
  <div class="collections-container">
    <h1 class="title">Dinosaur Collection</h1>

    <!-- Display Word -->
    <div class="word-container">
      <span v-for="(char, index) in letters" :key="index" class="letter">
        {{ index <= unlockedIndex ? char : '?' }}
      </span>
    </div>

    <!-- Dino Viewer with Arrows -->
    <div class="dino-display">
      <button v-if="selectedIndex > 0" class="arrow-btn prev-arrow" @click="prevDino">
        <img src="/public/left-arrow.png" alt="Previous" class="arrow-img" />
      </button>

      <div class="dino-content">
        <img :src="dinoImages[selectedIndex]" :alt="dinoNames[selectedIndex]" class="dino-image" />
        <p class="dino-name">{{ dinoNames[selectedIndex] }}</p>

        <div v-if="selectedIndex <= unlockedIndex" class="dino-actions">
          <button class="equip-btn">Equip</button>
          <button class="play-btn">Play</button>
        </div>

        <div v-else class="locked-state">
          <p class="unlock-cost">Unlock for {{ dinoCosts[selectedIndex] }} 🪙</p>
          <button
            class="unlock-btn"
            :disabled="coins < dinoCosts[selectedIndex]"
            @click="unlockDino"
          >
            Unlock
          </button>
        </div>
      </div>

      <button v-if="selectedIndex < dinoNames.length - 1" class="arrow-btn next-arrow" @click="nextDino">
        <img src="/public/right-arrow.png" alt="Next" class="arrow-img" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const letters = ['S', 'M', 'U', 'N', 'C', 'H']
const dinoNames = ['Stark', 'Milo', 'Uno', 'Nina', 'Cody', 'Hatch']
const dinoImages = [
  './public/stark.png',
  './public/milo.png',
  './public/uno.png',
  './public/cody.png',
  './public/hatch.png',
]
const dinoCosts = [0, 100, 200, 300, 400, 500]

const coins = ref(300)
const unlockedIndex = ref(0) // How many dinos are unlocked
const selectedIndex = ref(0) // Which dino the user is viewing

const unlockDino = () => {
  const cost = dinoCosts[selectedIndex.value]
  if (coins.value >= cost && selectedIndex.value === unlockedIndex.value + 1) {
    coins.value -= cost
    unlockedIndex.value++
  }
}

const prevDino = () => {
  if (selectedIndex.value > 0) selectedIndex.value--
}

const nextDino = () => {
  if (selectedIndex.value < dinoNames.length - 1) selectedIndex.value++
}
</script>

<style scoped>
.collections-container {
  max-width: 800px;
  margin: auto;
  padding: 5rem;
  text-align: center;
  font-family: 'Arial Rounded MT Bold', sans-serif;
  position: relative;
}

/* Title */
.title {
  font-size: 2.6rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 2.5rem;
  text-align: center;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}

/* Letter Progress Display */
.word-container {
  display: flex;
  justify-content: center;
  font-size: 4.5rem;
  gap: 2rem;
  margin-bottom: 2rem;
  letter-spacing: 0.3em;
}

.letter {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 2rem 2rem 3rem;
  border-radius: 20px;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.letter:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

/* Dino Display Area */
.dino-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rem;
  margin-top: 6rem;
  position: relative;
  min-height: 300px;
}

.arrow-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
}

.prev-arrow {
  left: -3rem;
}

.next-arrow {
  right: -3rem;
}

.arrow-btn:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  transform: translateY(-50%) scale(1.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-color: #dee2e6;
}

.arrow-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.arrow-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
  margin: 0;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.dino-content {
  text-align: center;
  width: 260px;
  margin: 0 auto;
  position: relative;
  left: 0;
  top: 0;
  transform: none;
  z-index: 1;
}

.dino-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.dino-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

/* Actions */
.dino-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.equip-btn,
.play-btn,
.unlock-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.equip-btn {
  background: #d9edf7;
  color: #31708f;
}

.play-btn {
  background: #f7c948;
  color: #7c5700;
}

.unlock-btn {
  background-color: #38c172;
  color: white;
}

.unlock-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.locked-state {
  margin-top: 1rem;
}

.unlock-cost {
  color: #888;
  margin-bottom: 0.5rem;
}
</style>
