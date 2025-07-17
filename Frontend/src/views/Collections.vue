<template>
  <div class="collections-container">
    <h1 class="title">Smunchy Collection</h1>

    <!-- Display Word -->
    <div class="word-container">
      <span 
        v-for="(char, index) in letters" 
        :key="index" 
        class="letter"
        :class="{ 
          'locked-letter': index > unlockedIndex,
          'just-unlocked': showLetterAnimation && index === justUnlockedIndex
        }"
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

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Confirm Unlock</h3>
        <p class="modal-message">
          Are you sure you want to unlock this smunchy for {{ dinoCosts[selectedIndex] }}<img src="../assets/smunch_coin.jpg" alt="Smunch Coin" class="modal-coin"/>?
        </p>
        <div class="modal-buttons">
          <button class="modal-btn modal-btn-no" @click="closeModal">No</button>
          <button class="modal-btn modal-btn-yes" @click="confirmUnlock">Yes</button>
        </div>
      </div>
    </div>

    <!-- Insufficient Balance Modal -->
    <div v-if="showInsufficientBalanceModal" class="modal-overlay" @click="closeInsufficientBalanceModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Insufficient Balance</h3>
        <p class="modal-message">
          You need {{ dinoCosts[selectedIndex] }}<img src="../assets/smunch_coin.jpg" alt="Smunch Coin" class="modal-coin"/> to unlock this smunchy, but you only have {{ coins }}<img src="../assets/smunch_coin.jpg" alt="Smunch Coin" class="modal-coin"/>.
        </p>
        <div class="modal-buttons">
          <button class="modal-btn modal-btn-no" @click="closeInsufficientBalanceModal">OK</button>
        </div>
      </div>
    </div>

    <!-- Spectacular Unlock Animation Overlay -->
    <div v-if="showUnlockAnimation" class="unlock-celebration-overlay">
      <!-- Confetti Particles -->
      <div class="confetti-container">
        <div v-for="i in 50" :key="i" class="confetti-piece" :style="{ 
          left: Math.random() * 100 + '%',
          animationDelay: Math.random() * 3 + 's',
          backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][Math.floor(Math.random() * 6)]
        }"></div>
      </div>
      
      <!-- Success Message -->
      <div class="unlock-success-message">
        <div class="success-icon">🎉</div>
        <h2 class="success-title">SMUNCHY UNLOCKED!</h2>
        <p class="success-subtitle">{{ dinoNames[justUnlockedIndex] }} has joined your collection!</p>
      </div>
      
      <!-- Spectacular Glow Effect -->
      <div class="unlock-glow-effect"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const letters = ['S', 'M', 'U', 'N', 'C', 'H']
const dinoNames = ['Stark', 'Milo', 'Uno', 'Nicole', 'Charlotte', 'Hatch']
const dinoDescriptions = [
  'A brave and adventurous smunchy who loves exploring new territories.',
  'A playful and energetic smunchy who enjoys making friends with everyone.',
  'A wise and thoughtful smunchy who loves solving puzzles and mysteries.',
  'A creative and artistic smunchy who expresses herself through beautiful colors.',
  'A gentle and caring smunchy who loves helping others and spreading kindness.',
  'A curious and intelligent smunchy who loves learning new things every day.'
]
const dinoFavoriteFoods = [
  'Shake Shack\'s SmokeShack',
  'Koufu\'s Kopi C Siew Dai',
  'Huevos',
  'Chocolate Milk',
  'Ben and Jerry\'s Ice Cream',
  'Jollibee Fried Chicken'
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

const coins = ref(20)
const unlockedIndex = ref(0) // How many dinos are unlocked
const selectedIndex = ref(0) // Which dino the user is viewing
const showConfirmModal = ref(false)
const showInsufficientBalanceModal = ref(false)
const showUnlockAnimation = ref(false)
const showLetterAnimation = ref(false)
const justUnlockedIndex = ref(-1)

const unlockDino = () => {
  showConfirmModal.value = true
}

const confirmUnlock = () => {
  const cost = dinoCosts[selectedIndex.value]
  console.log('Unlock attempt:', {
    selectedIndex: selectedIndex.value,
    unlockedIndex: unlockedIndex.value,
    cost: cost,
    coins: coins.value,
    canUnlock: selectedIndex.value === unlockedIndex.value + 1
  })
  
  // Close confirmation modal first
  closeModal()
  
  // Check if user has sufficient balance
  if (coins.value < cost) {
    // Show insufficient balance modal
    showInsufficientBalanceModal.value = true
    return
  }
  
  // Check if it's the next dino in sequence and proceed with unlock
  if (selectedIndex.value === unlockedIndex.value + 1) {
    coins.value -= cost
    justUnlockedIndex.value = unlockedIndex.value + 1
    unlockedIndex.value++
    
    // Trigger spectacular animations
    showUnlockAnimation.value = true
    showLetterAnimation.value = true
    
    // Hide animations after they complete
    setTimeout(() => {
      showUnlockAnimation.value = false
    }, 5000)
    
    setTimeout(() => {
      showLetterAnimation.value = false
      justUnlockedIndex.value = -1
    }, 4500)
    
    console.log('Unlock successful! New unlockedIndex:', unlockedIndex.value)
  }
}

const closeModal = () => {
  showConfirmModal.value = false
}

const closeInsufficientBalanceModal = () => {
  showInsufficientBalanceModal.value = false
}

const prevDino = () => {
  if (selectedIndex.value > 0) selectedIndex.value--
}

const nextDino = () => {
  if (selectedIndex.value < dinoNames.length - 1) selectedIndex.value++
}

// Computed property to check if current dinosaur can be unlocked (only check sequence)
const canUnlockCurrentDino = computed(() => {
  const isNextInSequence = selectedIndex.value === unlockedIndex.value + 1
  console.log('Can unlock check:', {
    selectedIndex: selectedIndex.value,
    unlockedIndex: unlockedIndex.value,
    isNextInSequence,
    canUnlock: isNextInSequence
  })
  return isNextInSequence
})
</script>

<style scoped>
.collections-container {
  max-width: 800px;
  margin: auto;
  padding: 3rem;
  text-align: center;
  font-family: 'Arial Rounded MT Bold', sans-serif;
  position: relative;
}

/* Title */
.title {
  font-size: 2.0rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}

/* Letter Progress Display */
.word-container {
  display: flex;
  justify-content: center;
  font-size: 4rem;
  gap: 2.5rem;
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
  margin-top: 1rem;
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
  z-index: 10;
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
  pointer-events: none;
}

.dino-content {
  text-align: center;
  width: 800px;
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
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(102, 126, 234, 0.15);
  letter-spacing: 0.02em;
}

.dino-info {
  margin: 1.5rem 0;
  text-align: center;
}

.dino-description {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.2rem;
  font-style: italic;
  font-weight: 500;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
  letter-spacing: 0.01em;
}

.dino-favorite-food {
  font-size: 1rem;
  font-weight: 700;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  display: inline-block;
}

.dino-favorite-food::before {
  content: '🍽️';
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.dino-favorite-food::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
  border-radius: 1px;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(102, 126, 234, 0.1);
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px 20px 0 0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-message {
  font-size: 1.1rem;
  font-weight: 400;
  color: #393f4a;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
}

.modal-coin {
  width: 28px;
  height: 28px;
  vertical-align: middle;
  object-fit: contain;
  background: transparent;
  border-radius: 50%;
  margin: 0;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-btn {
  padding: 0.8rem 2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.modal-btn-yes {
  background: linear-gradient(135deg, #38c172 0%, #2f855a 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(56, 193, 114, 0.3);
}

.modal-btn-yes:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(56, 193, 114, 0.4);
}

.modal-btn-no {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
}

.modal-btn-no:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 62, 62, 0.4);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Spectacular Unlock Animations */
.unlock-celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(102, 126, 234, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
  animation: celebrationFadeIn 0.5s ease-out;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 12px;
  height: 12px;
  top: -20px;
  transform: rotate(45deg);
  animation: confettiFall 3s linear forwards;
}

.unlock-success-message {
  text-align: center;
  color: white;
  z-index: 2001;
  animation: successMessageScale 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-icon {
  font-size: 5rem;
  animation: iconBounce 1.5s ease-in-out infinite;
  margin-bottom: 1rem;
}

.success-title {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: rainbowText 2s ease-in-out infinite, textGlow 2s ease-in-out infinite;
  margin-bottom: 1rem;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  letter-spacing: 0.1em;
}

.success-subtitle {
  font-size: 1.3rem;
  font-weight: 600;
  color: #f8f9fa;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  animation: subtitlePulse 2s ease-in-out infinite;
}

.unlock-glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glowPulse 2s ease-in-out infinite;
}

/* Letter Reveal Animation */
.letter.just-unlocked {
  animation: letterReveal 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.letter.just-unlocked::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.4), transparent);
  animation: letterSparkle 2s linear;
  z-index: -1;
}

.letter.just-unlocked::after {
  content: '✨';
  position: absolute;
  top: -20px;
  right: -10px;
  font-size: 2rem;
  animation: sparkleFloat 2s ease-in-out;
}

/* Keyframe Animations */
@keyframes celebrationFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(2px);
  }
}

@keyframes confettiFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes successMessageScale {
  0% {
    transform: scale(0.3) translateY(50px);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) translateY(-10px);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes iconBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-20px) scale(1.1);
  }
  60% {
    transform: translateY(-10px) scale(1.05);
  }
}

@keyframes rainbowText {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes textGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(102, 126, 234, 0.8));
  }
}

@keyframes subtitlePulse {
  0%, 100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

@keyframes glowPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.1;
  }
}

@keyframes letterReveal {
  0% {
    transform: scale(0.5) rotateY(-90deg);
    opacity: 0;
    filter: brightness(0.5);
  }
  25% {
    transform: scale(1.3) rotateY(0deg);
    opacity: 1;
    filter: brightness(2);
  }
  50% {
    transform: scale(1.1) rotateY(10deg);
    filter: brightness(1.5);
  }
  75% {
    transform: scale(1.05) rotateY(-5deg);
    filter: brightness(1.2);
  }
  100% {
    transform: scale(1) rotateY(0deg);
    opacity: 1;
    filter: brightness(1);
  }
}

@keyframes letterSparkle {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0;
  }
}

@keyframes sparkleFloat {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  25% {
    transform: translateY(-30px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-60px) scale(0);
    opacity: 0;
  }
}
</style>
