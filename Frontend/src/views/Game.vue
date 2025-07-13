<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { fetchAllMerchants } from '@/services/orderFoodService'

const showWheel = ref(false)
const showPoker = ref(false)
const showResult = ref(false)
const result = ref('')
const spinning = ref(false)
const shuffling = ref(false)
const merchants = ref([])
const wheelOptions = ref([])
const pokerOptions = ref([])
const wheelAngle = ref(0)
const selectedWheel = ref('')
const selectedPoker = ref('')

onMounted(async () => {
  try {
    const res = await fetchAllMerchants()
    console.log("Fetched merchants:", res.data)
    merchants.value = res.data
    // Use all merchants for the games
    wheelOptions.value = merchants.value.map(m => m.name)
    pokerOptions.value = merchants.value.map(m => m.name)
  } catch (e) {
    // fallback to default if fetch fails
    console.error("Error fetching merchants:", e)  
    wheelOptions.value = ['Supergreen', 'Koufu', 'Braek']
    pokerOptions.value = ['Supergreen', 'Koufu', 'Braek']
  }
  console.log(wheelOptions)
})

const wheelGradient = computed(() => {
  const colors = ['#5ea6c4', '#b2f7ef', '#468d8c', '#c8e6c9', '#81d4fa', '#ffd600', '#ffb74d', '#a5d6a7']
  const n = wheelOptions.value.length
  const angle = 360 / n
  let gradient = `conic-gradient(`
  for (let i = 0; i < n; i++) {
    const start = i * angle
    const end = (i + 1) * angle
    const color = colors[i % colors.length]
    gradient += `${color} ${start}deg ${end}deg${i < n - 1 ? ', ' : ''}`
  }
  gradient += `)`
  return gradient
})

function openWheel() {
  showWheel.value = true
  showPoker.value = false
  showResult.value = false
  result.value = ''
  selectedWheel.value = ''
}
function openPoker() {
  showPoker.value = true
  showWheel.value = false
  showResult.value = false
  result.value = ''
  selectedPoker.value = ''
}
function closeGame() {
  showWheel.value = false
  showPoker.value = false
  showResult.value = false
  result.value = ''
  selectedWheel.value = ''
  selectedPoker.value = ''
}
function spinWheel() {
  if (spinning.value) return
  spinning.value = true
  showResult.value = false
  // Randomly select a segment
  const opts = wheelOptions.value
  const idx = Math.floor(Math.random() * opts.length)
  const anglePer = 360 / opts.length
  // Spin at least 3 full turns + land on the selected
  const finalAngle = 360 * 3 + (360 - idx * anglePer - anglePer / 2)
  wheelAngle.value = finalAngle
  setTimeout(() => {
    spinning.value = false
    selectedWheel.value = opts[idx]
    showResult.value = true
  }, 2200)
}
function getSegmentStyle(i) {
  const n = wheelOptions.value.length || 1
  const angle = 360 / n
  const colors = ['#5ea6c4', '#b2f7ef', '#468d8c', '#c8e6c9', '#81d4fa', '#ffd600', '#ffb74d', '#a5d6a7']
  // Each segment is a pie slice using clip-path
  return {
    '--segment-rotate': `${i * angle}deg`,
    '--segment-color': colors[i % colors.length],
    zIndex: n - i
  }
}
function getTextStyle(i, angle) {
  const n = wheelOptions.value.length || 1
  const step = 360 / n
  return {
    transform: `rotate(${-i * step - angle + step / 2}deg) translateY(-90px)`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '90px',
    marginLeft: '-45px',
    textAlign: 'center',
    pointerEvents: 'none'
  }
}
// For Poker game: show cards, animate shuffling
const pokerShuffled = ref([])
function showPokerCards() {
  // Always show the cards, even before shuffling
  pokerShuffled.value = pokerOptions.value.map((name, idx) => ({
    name,
    image: (merchants.value.find(m => m.name === name) || {}).image_url || '',
    highlight: false
  }))
}
watch(pokerOptions, showPokerCards)
function shufflePoker() {
  if (shuffling.value) return
  shuffling.value = true
  showResult.value = false
  const opts = pokerOptions.value
  // Animate shuffling: highlight cards in sequence
  let count = 0
  const maxCount = 40 // ~5 seconds at 125ms per step
  const interval = setInterval(() => {
    pokerShuffled.value.forEach((c, i) => c.highlight = false)
    const idx = Math.floor(Math.random() * opts.length)
    pokerShuffled.value[idx].highlight = true
    count++
    if (count > maxCount) {
      clearInterval(interval)
      // Pick a final card
      const finalIdx = Math.floor(Math.random() * opts.length)
      pokerShuffled.value.forEach((c, i) => c.highlight = i === finalIdx)
      selectedPoker.value = opts[finalIdx]
      showResult.value = true
      shuffling.value = false
    }
  }, 125)
}
</script>

<template>
    <div class="game no-scroll">
      <div class="game-page">
        <h1 class="game-title">Game Zone</h1>
        <div v-if="!showWheel && !showPoker" class="game-options">
          <div class="game-card wheel-game" @click="openWheel">
            <img src="/dinoSpinTheWheel.png" class="game-icon" alt="Spin the Wheel" />
            <p>Spin the Wheel</p>
          </div>
          <div class="game-card poker-game" @click="openPoker">
            <img src="/dinoPokerCards.png" class="game-icon" alt="Poker Game" />
            <p>Poker</p>
          </div>
          <div class="game-card disabled">
            <img src="/dinoGuessEmojis.png" class="game-icon" alt="Emoji Guessing Game" />
            <p>Guess the Emojis</p>
          </div>
        </div>
        <!-- Spin the Wheel Game -->
        <div v-if="showWheel" class="game-modal">
          <button class="close-btn" @click="closeGame">×</button>
          <h2>Spin the Wheel</h2>
          <div class="wheel" :style="{ transform: `rotate(${wheelAngle}deg)`, background: wheelGradient }">
            <div class="wheel-label" v-for="(opt, i) in wheelOptions" :key="opt"
                :style="getTextStyle(i, wheelAngle)">
              {{ opt }}
            </div>
          </div>
          <div class="wheel-pointer">▼</div>
          
          <button class="spin-btn" :disabled="spinning" @click="spinWheel">
            {{ spinning ? 'Spinning...' : 'Spin' }}
          </button>
          <div v-if="showResult" class="result">
            Result: <b>{{ selectedWheel }}</b>
          </div>
        </div>
        <!-- Poker Game -->
        <div v-if="showPoker" class="game-modal">
          <button class="close-btn" @click="closeGame">×</button>
          <h2>Poker</h2>
          <div class="poker-cards">
            <div v-for="card in pokerShuffled" :key="card.name" class="poker-card" :class="{ selected: card.highlight }">
              <img v-if="card.image" :src="card.image" class="poker-img" :alt="card.name" />
              <div class="poker-name">{{ card.name }}</div>
            </div>
          </div>
          <button class="spin-btn" :disabled="shuffling" @click="shufflePoker">{{ shuffling ? 'Shuffling...' : 'Shuffle' }}</button>
          <div v-if="showResult" class="result">Result: <b>{{ selectedPoker }}</b></div>
        </div>
      </div>
    </div>
</template>

<style scoped>

.game.no-scroll {
  position: fixed;
  top: 60px; /* adjust if you have a header height */
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px); /* fills viewport minus header */
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.game-page {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 80px;
}

.game-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 2.5rem;
  text-align: center;
}
.game-options {
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: center;
}
.game-card {
  width: 270px;
  height: 270px;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  cursor: pointer;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.85);
  transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
  border: 1.5px solid #e0e0e0;
}
.game-card p {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
}
.wheel-game {
  background: linear-gradient(135deg, #5ea6c4 0%, #b2f7ef 100%);
  color: #134e4a;
}
.poker-game {
  background: linear-gradient(135deg, #468d8c 0%, #b2f7ef 100%);
  color: #134e4a;
}
.game-card:hover:not(.disabled) {
  transform: translateY(-10px) scale(1.04);
  box-shadow: 0 16px 48px rgba(44, 62, 80, 0.18);
  background: #e0f2f1;
}
.game-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.game-icon {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 1.5rem;
  display: block;
}

.game-modal {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.18);
  padding: 40px 48px;
  min-width: 350px;
  max-width: 98vw;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
.wheel-container {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 32px auto 24px auto;
}
.wheel {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 8px solid #b2f7ef;
  background: none;
  position: relative;
  transition: transform 2.2s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-label {
  font-size: 1rem;
  font-weight: 600;
  color: #134e4a;
  background: #ffffffcc;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 90px;
  margin-left: -45px;
  text-align: center;
  pointer-events: none;
}
.wheel-pointer {
  position: absolute;
  left: 50%;
  top: -24px;
  transform: translateX(-50%);
  font-size: 2.2rem;
  color: #17614a;
  z-index: 2;
}
.spin-btn {
  background: #17614a;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 40px;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 auto;
  display: block;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.spin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.result {
  margin-top: 24px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #17614a;
}
.poker-cards {
  display: flex;
  gap: 2rem;
  margin: 32px 0 24px 0;
  justify-content: center;
}
.poker-card {
  width: 110px;
  height: 150px;
  background: #e0f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #134e4a;
  border: 2px solid #b2f7ef;
  transition: background 0.18s, border 0.18s, box-shadow 0.18s;
  position: relative;
}
.poker-card.selected {
  background: #b2f7ef;
  border: 2.5px solid #17614a;
  box-shadow: 0 0 16px #17614a44;
}
.poker-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 8px;
}
.poker-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #134e4a;
  text-align: center;
}
</style> 