<template>
  <div class="collections-container">
    <h1 class="title">Dinosaur Collection</h1>

    <!-- Display Word -->
    <div class="word-container">
      <span 
        v-for="(char, index) in letters" 
        :key="index" 
        class="letter"
        :class="{ 'locked-letter': index > unlockedIndex }"
      >
        {{ index <= unlockedIndex ? char : '?' }}
      </span>
    </div>

    <!-- Dino Viewer with Arrows -->
    <div class="dino-display">
      <button v-if="selectedIndex > 0" class="arrow-btn prev-arrow" @click="prevDino">
        <img src="/public/left-arrow.png" alt="Previous" class="arrow-img" />
      </button>

      <div class="dino-content">
        <div v-if="selectedIndex <= unlockedIndex" class="dino-image-container">
          <img :src="dinoImages[selectedIndex]" :alt="dinoNames[selectedIndex]" class="dino-image" />
        </div>
        <div v-else-if="selectedIndex === unlockedIndex + 1" class="tease-container">
          <img :src="dinoImages[selectedIndex]" :alt="dinoNames[selectedIndex]" class="dino-image tease-image" />
          <span class="tease-question-mark">?</span>
        </div>
        <div v-else class="mystery-container">
          <img src="/dinoEgg.png" alt="Dino Egg" class="egg-background" />
          <div class="mystery-mark">?</div>
        </div>
        <p v-if="selectedIndex <= unlockedIndex" class="dino-name">{{ dinoNames[selectedIndex] }}</p>

        <div v-if="selectedIndex <= unlockedIndex" class="dino-info">
          <p class="dino-description">{{ dinoDescriptions[selectedIndex] }}</p>
          <p class="dino-favorite-food">Favorite Food: {{ dinoFavoriteFoods[selectedIndex] }}</p>
        </div>

        <div v-if="selectedIndex <= unlockedIndex" class="dino-actions">
          <button class="equip-btn">Equip</button>
          <button class="play-btn">Play</button>
        </div>

        <div v-else-if="selectedIndex === unlockedIndex + 1" class="locked-state">
          <button
            class="unlock-btn"
            :disabled="!canUnlockCurrentDino"
            @click="unlockDino"
          >
            Unlock {{ dinoCosts[selectedIndex] }} <img src="../assets/smunch_coin.jpg" alt="Smunch Coin" class="button-coin" />
          </button>
        </div>
      </div>

      <button v-if="selectedIndex < dinoNames.length - 1" class="arrow-btn next-arrow" @click="nextDino">
        <img src="/public/right-arrow.png" alt="Next" class="arrow-img" />
      </button>
    </div>

    <!-- Dino Page Indicator -->
    <div class="page-indicator">
      <span 
        v-for="(dino, index) in dinoNames" 
        :key="index" 
        class="indicator-dot"
        :class="{ active: index === selectedIndex }"
        @click="selectedIndex = index"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const letters = ['S', 'M', 'U', 'N', 'C', 'H']
const dinoNames = ['Stark', 'Milo', 'Uno', 'Nicole', 'Charlotte', 'Hatch']
const dinoDescriptions = [
  'A brave and adventurous dinosaur who loves exploring new territories.',
  'A playful and energetic dinosaur who enjoys making friends with everyone.',
  'A wise and thoughtful dinosaur who loves solving puzzles and mysteries.',
  'A creative and artistic dinosaur who expresses herself through beautiful colors.',
  'A gentle and caring dinosaur who loves helping others and spreading kindness.',
  'A curious and intelligent dinosaur who loves learning new things every day.'
]
const dinoFavoriteFoods = [
  '🍎 Fresh Apples',
  '🍕 Pepperoni Pizza',
  '🍦 Vanilla Ice Cream',
  '🍰 Chocolate Cake',
  '🍓 Strawberry Smoothie',
  '🍪 Chocolate Chip Cookies'
]
const dinoImages = [
  './public/stark.png',
  './public/milo.png',
  './public/uno.png',
  './public/nicole.png',
  './public/charlotte.png',
  './public/hatch.png',
]
const dinoCosts = [0, 100, 200, 300, 400, 500]

const coins = ref(2000)
const unlockedIndex = ref(0) // How many dinos are unlocked
const selectedIndex = ref(0) // Which dino the user is viewing

const unlockDino = () => {
  const cost = dinoCosts[selectedIndex.value]
  console.log('Unlock attempt:', {
    selectedIndex: selectedIndex.value,
    unlockedIndex: unlockedIndex.value,
    cost: cost,
    coins: coins.value,
    canUnlock: selectedIndex.value === unlockedIndex.value + 1
  })
  if (coins.value >= cost && selectedIndex.value === unlockedIndex.value + 1) {
    coins.value -= cost
    unlockedIndex.value++
    console.log('Unlock successful! New unlockedIndex:', unlockedIndex.value)
  }
}

const prevDino = () => {
  if (selectedIndex.value > 0) selectedIndex.value--
}

const nextDino = () => {
  if (selectedIndex.value < dinoNames.length - 1) selectedIndex.value++
}

// Computed property to check if current dinosaur can be unlocked
const canUnlockCurrentDino = computed(() => {
  const hasEnoughCoins = coins.value >= dinoCosts[selectedIndex.value]
  const isNextInSequence = selectedIndex.value === unlockedIndex.value + 1
  console.log('Can unlock check:', {
    selectedIndex: selectedIndex.value,
    unlockedIndex: unlockedIndex.value,
    hasEnoughCoins,
    isNextInSequence,
    canUnlock: hasEnoughCoins && isNextInSequence
  })
  return hasEnoughCoins && isNextInSequence
})
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

.locked-letter {
  background: #e0e0e0; /* Grey background for locked letters */
  color: #888; /* Darker text for locked letters */
  box-shadow: none; /* Remove shadow for locked letters */
  border: 3px solid #ccc; /* Lighter border for locked letters */
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

.tease-container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
}

.tease-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(0) contrast(1000%) drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
  opacity: 0.6;
}

.tease-question-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rotate3d 4s linear infinite;
  z-index: 2;
  transform-style: preserve-3d;
  perspective: 500px;
  backface-visibility: visible;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2));
}

.mystery-container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  perspective: 500px;
}

.mystery-mark {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rotate3d 5s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  perspective: 500px;
  backface-visibility: visible;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2));
  opacity: 0.9;
}

.egg-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 85%;
  object-fit: contain;
  opacity: 0.8;
  z-index: -1;
}

@keyframes rotate3d {
  0% {
    transform: translate(-50%, -50%) rotateY(0deg);
  }
  25% {
    transform: translate(-50%, -50%) rotateY(90deg);
  }
  50% {
    transform: translate(-50%, -50%) rotateY(180deg);
  }
  75% {
    transform: translate(-50%, -50%) rotateY(270deg);
  }
  100% {
    transform: translate(-50%, -50%) rotateY(360deg);
  }
}

.dino-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.dino-info {
  margin: 1rem 0;
  text-align: center;
}

.dino-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  font-style: italic;
}

.dino-favorite-food {
  font-size: 0.85rem;
  color: #888;
  font-weight: 500;
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

.button-coin {
  width: 36px;
  height: 36px;
  margin-left: -8px;
  vertical-align: middle;
  object-fit: contain;
  background: transparent;
  border-radius: 50%;
}

/* Page Indicator */
.page-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  margin-top: 2rem;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.indicator-dot:hover {
  background-color: #d0d0d0;
  transform: scale(1.1);
}

.indicator-dot.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transform: scale(1.2);
}
</style>
