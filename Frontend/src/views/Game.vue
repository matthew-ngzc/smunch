<script setup>
import { ref, onMounted, watch } from 'vue'
import VueWheelSpinner from 'vue-wheel-spinner'
import { fetchAllMerchants } from '@/services/orderFoodService'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

// ----- WHEEL STATE -----
const showWheel = ref(false)
const showPoker = ref(false)
const slices = ref([])
const spinnerRef = ref(null)
const defaultWinner = ref(0)
const winnerResult = ref(null)
const spinning = ref(false)
const route = useRoute()
const router = useRouter()

// Wheel cursor options (you already had these)
const cursorAngle = 0
const cursorPosition = 'edge'
const cursorDistance = 0

// ----- POKER STATE -----
const pokerOptions = ref([])
const pokerShuffled = ref([])
const shuffling = ref(false)
const pokerResult = ref(null)

// ----- GUESS THE EMOJIS STATE & DATA -----
const showEmojis = ref(false)
const emojiGame = ref({}) // { merchant, emoji, answer, slots, tiles }
const emojiMappings = [
  { merchant: 'Koufu', emoji: '👄🫃' },
  { merchant: 'Luckin', emoji: '🇨🇳🦌🤳' },
  { merchant: 'Supergreen', emoji: '🦸‍♂️🟢🍴' },
  { merchant: 'WokHey', emoji: '👨‍🍳🍳👋' },
  { merchant: 'Braek', emoji: '🧠😮‍💨🛌😋' },
]
const emojiSlots = ref([]) // [{letter, filledLetter}]
const emojiTiles = ref([]) // [{letter, used}]
const emojiGuess = ref([]) // user's current guess (array of letters)
const emojiError = ref('')
const emojiWin = ref(false)
const confettiActive = ref(false)

// ----- DINO POPUP STATE -----
const showDino = ref(false)
const dinoMerchant = ref('')
const dinoTimeout = ref(null)
const dinoLoading = ref(false)
const dinoCountdown = ref(15)
let dinoCountdownInterval = null

function showDinoPopup(merchant) {
  dinoMerchant.value = merchant
  showDino.value = true
  dinoLoading.value = true
  dinoCountdown.value = 10
  if (dinoCountdownInterval) clearInterval(dinoCountdownInterval)
  dinoCountdownInterval = setInterval(() => {
    if (dinoCountdown.value > 0) dinoCountdown.value--
  }, 1000)
  // Start 10s timer to auto-redirect
  dinoTimeout.value = setTimeout(() => {
    dinoLoading.value = false
    showDino.value = false
    if (dinoMerchant.value && dinoMerchant.value.merchant_id && dinoMerchant.value.has_children == false ) {
      router.push(`/order/${dinoMerchant.value.merchant_id}`)
    } else {
      router.push('/order')
    }
  }, 10000)
}
function cancelDinoPopup() {
  showDino.value = false
  dinoLoading.value = false
  if (dinoTimeout.value) clearTimeout(dinoTimeout.value)
  if (dinoCountdownInterval) clearInterval(dinoCountdownInterval)
}

// ----- FETCH MERCHANTS ON MOUNT -----
onMounted(async () => {

  showWheel.value = false
  showPoker.value = false
  showEmojis.value = false

  try {
    const res = await fetchAllMerchants()
    const merchants = res.data

    // Build wheel slices
    const wheelColors = ['#5ea6c4', '#b2f7ef', '#468d8c', '#c8e6c9', '#81d4fa', '#ffd600', '#ffb74d', '#a5d6a7']
    slices.value = merchants.map((m, i) => ({
      color: wheelColors[i % wheelColors.length],
      text: m.name,
      merchant: m
    }))

    // Build poker options
    pokerOptions.value = merchants.map(m => m)
    // initialize the “deck” for display
    pokerShuffled.value = pokerOptions.value.map(name => ({
      name,
      image: (merchants.find(m => m.name === name) || {}).image_url || '',
      highlight: false
    }))

  } catch (err) {
    console.error(err)
    // fallback for both games
    slices.value = [
      { color: '#5ea6c4', text: 'Supergreen' },
      { color: '#b2f7ef', text: 'Koufu' },
      { color: '#468d8c', text: 'Braek' }
    ]
    pokerOptions.value = ['Supergreen', 'Koufu', 'Braek']
    pokerShuffled.value = pokerOptions.value.map(name => ({ name, image: '', highlight: false }))
  }
})

watch(() => route.path, (newPath) => {
  if (newPath === '/game') {
    showWheel.value = false
    showPoker.value = false
    showEmojis.value = false
    winnerResult.value = null
    pokerResult.value = null
    confettiActive.value = false
  }
})

// ----- WHEEL FUNCTIONS -----
function handleSpinButtonClick() {
  defaultWinner.value = Math.floor(Math.random() * slices.value.length)
  spinnerRef.value.spinWheel(defaultWinner.value)
}

function onSpinStart() {
  spinning.value = true
  winnerResult.value = null
}

function onSpinEnd(winnerIndex) {
  spinning.value = false
  winnerResult.value = slices.value[winnerIndex]
  if (winnerResult.value?.merchant) {
    showDinoPopup(winnerResult.value.merchant)
  }
}

// ----- POKER FUNCTIONS -----
function showPokerCards() {
  pokerShuffled.value = pokerOptions.value.map((merchant) => ({
    name: merchant.name,
    image: merchant.image_url || '',
    highlight: false,
    merchant_id: merchant.merchant_id
  }))
}
watch(pokerOptions, showPokerCards, { immediate: true })

function shufflePoker() {
  if (shuffling.value) return
  shuffling.value = true
  pokerResult.value = null

  const opts = pokerOptions.value
  let count = 0
  const maxCount = 40
  const iv = setInterval(() => {
    pokerShuffled.value.forEach(c => c.highlight = false)
    const idx = Math.floor(Math.random() * opts.length)
    pokerShuffled.value[idx].highlight = true
    count++
    if (count > maxCount) {
      clearInterval(iv)
      const finalIdx = Math.floor(Math.random() * opts.length)
      const selected = opts[finalIdx]
      pokerShuffled.value.forEach((c, i) => c.name === selected.name ? c.highlight = true : c.highlight = false)
      pokerResult.value = selected
      shuffling.value = false

      if (pokerResult.value) {
        showDinoPopup(pokerResult.value)
      }

    }
  }, 125)
}

// ----- GUESS THE EMOJIS FUNCTIONS -----
function openEmojis() {
  // Pick a random merchant
  const pick = emojiMappings[Math.floor(Math.random() * emojiMappings.length)]
  const answer = pick.merchant.toUpperCase().split('')
  // Shuffle answer letters
  const shuffled = [...answer]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  // Add extra random letters (distractors)
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const distractors = []
  while (distractors.length < Math.max(3, Math.ceil(answer.length / 2))) {
    const rand = alphabet[Math.floor(Math.random() * alphabet.length)]
    if (!answer.includes(rand) && !distractors.includes(rand)) {
      distractors.push(rand)
    }
  }
  let allTiles = [...shuffled, ...distractors]
  // Shuffle all tiles
  for (let i = allTiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[allTiles[i], allTiles[j]] = [allTiles[j], allTiles[i]]
  }
  emojiGame.value = { ...pick, answer }
  emojiSlots.value = answer.map(() => null)
  emojiTiles.value = allTiles.map(l => ({ letter: l, used: false }))
  emojiGuess.value = Array(answer.length).fill('')
  emojiError.value = ''
  emojiWin.value = false
  confettiActive.value = false
  showEmojis.value = true
  showWheel.value = false
  showPoker.value = false
}
function closeEmojis() {
  showEmojis.value = false
  emojiError.value = ''
  emojiWin.value = false
  confettiActive.value = false
}

// Drag and drop logic
function onDragStartTile(idx) {
  if (emojiTiles.value[idx].used) return
  event.dataTransfer.setData('text/plain', idx)
}
function onDropSlot(slotIdx) {
  event.preventDefault()
  const tileIdx = event.dataTransfer.getData('text/plain')
  if (tileIdx === null) return
  const tile = emojiTiles.value[tileIdx]
  if (!tile || tile.used) return
  // Place letter in slot
  if (emojiSlots.value[slotIdx]) return // already filled
  emojiSlots.value[slotIdx] = tile.letter
  emojiTiles.value[tileIdx].used = true
  emojiGuess.value[slotIdx] = tile.letter
  emojiError.value = ''
  // Check if all slots filled
  if (emojiGuess.value.every(l => l)) {
    checkEmojiAnswer()
  }
}
function allowDropSlot() {
  event.preventDefault()
}
function removeLetterFromSlot(slotIdx) {
  const letter = emojiSlots.value[slotIdx]
  if (!letter) return
  // Find the tile and mark as unused
  const tileIdx = emojiTiles.value.findIndex(t => t.letter === letter && t.used)
  if (tileIdx !== -1) emojiTiles.value[tileIdx].used = false
  emojiSlots.value[slotIdx] = null
  emojiGuess.value[slotIdx] = ''
  emojiError.value = ''
}
function checkEmojiAnswer() {
  const guess = emojiGuess.value.join('')
  const answer = emojiGame.value.answer.join('')
  if (guess === answer) {
    emojiWin.value = true
    emojiError.value = ''
    confettiActive.value = true
    setTimeout(() => { confettiActive.value = false }, 2500)
    // For emoji game, only merchant name is available, so pass an object with name only
    const normalize = name => name.replace(/\s+/g, '').toLowerCase()
    const matchedMerchant = pokerOptions.value.find(m =>
      normalize(m.name) === normalize(emojiGame.value.merchant)
    )
    // Tries to find the actual merchant from the list (which includes merchant_id) and falls back to just the name if not found
    if (matchedMerchant) {
      showDinoPopup(matchedMerchant)
    } else {
      showDinoPopup({ name: emojiGame.value.merchant })
    }
  } else {
    emojiError.value = 'Wrong! Try again.'
    // Optionally: clear all slots and tiles
    setTimeout(() => {
      emojiSlots.value = emojiGame.value.answer.map(() => null)
      emojiTiles.value.forEach(t => t.used = false)
      emojiGuess.value = Array(emojiGame.value.answer.length).fill('')
      emojiError.value = ''
    }, 1200)
  }
}

// ----- PANEL OPEN/CLOSE -----
function openPoker() {
  showPoker.value = true
  showWheel.value = false
  winnerResult.value = null
  pokerResult.value = null
}
function closeGame() {
  showWheel.value = false
  showPoker.value = false
  winnerResult.value = null
  pokerResult.value = null
}
</script>

<template>
  <div class="game no-scroll">
    <div class="game-page">
      <div class="game-title-split">
        <div class="title-text-left"><span>welcome to</span></div>
        <img src="/dinoFaceForward.png" class="dino-peek" alt="dino" />
        <div class="title-text-right"><span>smunch game zone!</span></div>
      </div>


      <!-- CHOICE SCREEN -->
     <!-- choice screen container -->
      <div v-if="!showWheel && !showPoker && !showEmojis" class="game-choice-wrapper">
        

        <div class="game-options">

          <div class="header">select a game to play!</div>

          <div class="content"> 
              <div class="game-card wheel-game" @click="showWheel = true">
              <img src="/dinoSpinTheWheel.png" class="game-icon" alt="Spin the Wheel" />
              <p>Spin The Wheel</p>
            </div>
            <div class="game-card poker-game" @click="openPoker">
              <img src="/dinoPokerCards.png" class="game-icon" alt="Poker Game" />
              <p>Poker Roulette</p>
            </div>
            <div class="game-card emoji-game" @click="openEmojis">
              <img src="/dinoGuessEmojis.png" class="game-icon" alt="Emoji Guessing Game" />
              <p>Guess The Emojis</p>
            </div>
          </div>
          
        </div>
      </div>      


      <!-- WHEEL SCREEN -->
      <div v-if="showWheel" class="game-modal">
        <button class="close-btn" @click="closeGame">×</button>
        <h2>Spin the Wheel</h2>

        <VueWheelSpinner ref="spinnerRef" class="spinner" :slices="slices" :winner-index="defaultWinner"
          :cursor-angle="cursorAngle" :cursor-position="cursorPosition" :cursor-distance="cursorDistance"
          @spin-start="onSpinStart" @spin-end="onSpinEnd">
          <template #cursor>
            <div class="wheel-pointer-big">⭐️</div>
          </template>
          <template #default>
            <button class="spin-btn" :disabled="spinning" @click="handleSpinButtonClick">Spin</button>
          </template>
        </VueWheelSpinner>

        <div v-if="winnerResult" class="result">
          Result: <b>{{ winnerResult.text }}</b>
        </div>

        <div v-if="showDino" class="dino-popup-inner">
          <img src="/dinoRun.png" class="dino-img" alt="Dino running" />
          <div class="dino-bubble">
            Transporting you to {{ dinoMerchant?.name || dinoMerchant }} right now!
            <span v-if="dinoLoading" style="display:inline-flex;align-items:center;gap:8px;">
              <div class="dino-loader"></div>
              <span class="dino-countdown">{{ dinoCountdown }}s</span>
            </span>
          </div>
          <button v-if="dinoLoading" class="dino-cancel" @click="cancelDinoPopup">Not now</button>
        </div>
      </div>

      <!-- POKER SCREEN -->
      <div v-if="showPoker" class="game-modal">
        <button class="close-btn" @click="closeGame">×</button>
        <h2>Smunch Poker Roulette</h2>

        <div class="poker-cards">
          <div v-for="card in pokerShuffled" :key="card.merchant_id || card.name" class="poker-card" :class="{ selected: card.highlight }">
            <img v-if="card.image" :src="card.image" class="poker-img" :alt="card.name" />
            <div class="poker-name">{{ card.name }}</div>
          </div>
        </div>

        <button class="spin-btn" :disabled="shuffling" @click="shufflePoker">
          {{ shuffling ? 'Shuffling...' : 'Shuffle' }}
        </button>

        <div v-if="pokerResult" class="result">
          Result: <b>{{ pokerResult.name }}</b>
        </div>

        <div v-if="showDino" class="dino-popup-inner">
          <img src="/dinoRun.png" class="dino-img" alt="Dino running" />
          <div class="dino-bubble">
            Transporting you to {{ dinoMerchant?.name || dinoMerchant }} right now!
            <span v-if="dinoLoading" style="display:inline-flex;align-items:center;gap:8px;">
              <div class="dino-loader"></div>
              <span class="dino-countdown">{{ dinoCountdown }}s</span>
            </span>
          </div>
          <button v-if="dinoLoading" class="dino-cancel" @click="cancelDinoPopup">Not now</button>
        </div>
      </div>

      <!-- GUESS THE EMOJIS GAME -->
      <div v-if="showEmojis" class="game-modal">
        <button class="close-btn" @click="closeEmojis">×</button>
        <h2>Guess the Merchant with the Following Emojis!</h2>
        <div class="emoji-hint">{{ emojiGame.emoji }}</div>
        <div class="hangman-slots">
          <div v-for="(slot, idx) in emojiSlots" :key="'slot' + idx" class="hangman-slot" :class="{ filled: !!slot }"
            @dragover.prevent="allowDropSlot" @drop="onDropSlot(idx)" @click="removeLetterFromSlot(idx)">
            <span v-if="slot">{{ slot }}</span>
            <span v-else>&nbsp;</span>
          </div>
        </div>
        <div class="hangman-tiles">
          <div v-for="(tile, idx) in emojiTiles" :key="'tile' + idx + tile.letter" class="hangman-tile"
            :class="{ used: tile.used }" draggable="true" @dragstart="onDragStartTile(idx)">
            {{ tile.letter }}
          </div>
        </div>
        <div v-if="emojiError" class="emoji-error">{{ emojiError }}</div>
        <div v-if="emojiWin" class="emoji-success">
          🎉 Correct! The merchant is <b>{{ emojiGame.merchant }}</b>!
        </div>
        <div v-if="confettiActive" class="confetti"></div>

        <div v-if="showDino" class="dino-popup-inner">
          <img src="/dinoRun.png" class="dino-img" alt="Dino running" />
          <div class="dino-bubble">
            Transporting you to {{ dinoMerchant?.name || dinoMerchant }} right now!
            <span v-if="dinoLoading" style="display:inline-flex;align-items:center;gap:8px;">
              <div class="dino-loader"></div>
              <span class="dino-countdown">{{ dinoCountdown }}s</span>
            </span>
          </div>
          <button v-if="dinoLoading" class="dino-cancel" @click="cancelDinoPopup">Not now</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>


.game-title-split {
  display: flex;
  align-items: center; /* keeps things aligned at the base */
  justify-content: center;
  gap: 6rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  text-align: center;
  font-size: 2.7rem;
  font-weight: 800;
  color: #062122;
 
}

.title-text-left,
.title-text-right {
  display: flex;
  align-items: flex-start;
  font-size: 2.6rem;
  font-weight: 800;
  color: #134e4a;
  text-align: center;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  margin-top: 80px; /* ⬅️ shift text down without moving dino */
 
}

.title-text-left span,
.title-text-right span {
  display: inline-block;
  line-height: 1.2;
   margin-left: 170px;
   font-weight: bold;
   
}


.dino-peek {
  position: absolute;
  height: 340px;
  object-fit: contain;
  margin-bottom: -85px; /* nudges the dino into the cards */
  pointer-events: none;
  transition: transform 0.3s ease-in-out;
  z-index: 100;
}

.game-title-split:hover .dino-peek {
  animation: dinoAlive 1.8s ease-in-out;
}


@keyframes dinoAlive {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  25% {
    transform: translateY(-4px) scale(1.02, 0.98) rotate(-2deg);
  }
  50% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  75% {
    transform: translateY(-3px) scale(1.01, 0.99) rotate(2deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
}


.game.no-scroll {
  position: fixed;
  top: 60px;
  /* adjust if you have a header height */
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  /* fills viewport minus header */
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


.game-options {
  display: flex;
  justify-content: center;
  flex-direction:column;
  align-items: center;
  margin-top: 0px;
  background-color: rgb(255, 255, 255);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 0 10px grey;
  width: 840px;
}

.header {
  font-size: 30px;
  font-weight: bold;
  margin-top: 20px;
  color: black;
}


.content {
  display: flex;
  gap: 35px;
  
}

.game-card {
  width: 200px;
  height: 200px;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  cursor: pointer;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
  border: 1.5px solid #e0e0e0;
  margin-bottom: 50px;
  margin-top: 30px;
}

.game-card p {
  font-size: 1.5rem;
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
  display: block;
}

.game-modal {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.18);
  padding: 48px 32px;
  max-width: 95vw;
  max-height: 90vh;
  margin-top: 10px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: fit-content;
  height: fit-content;
  min-width: 800px;
}


.game-modal h2 {
  font-weight: bold;
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

.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 350px;
  max-height: 350px; 
  margin-top: 40px;
  margin-left: 100px;
  margin-right: 100px;
}

.wheel-pointer-big {
  position: absolute;
  left: 50%;
  top: -40px;
  transform: translateX(-50%);
  font-size: 2.8rem;
  color: #17614a;
  z-index: 10;
  text-shadow: 0 2px 8px #0001;
}

.spin-btn {
  background-color: #0d3d31;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.spin-btn:hover {
  background-color: #11534a;
}

.spin-btn:disabled {
  background-color: #a9b5bd;
  cursor: not-allowed;
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
  gap: 1rem;
  margin: 32px 0 24px 0;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 100%;
  overflow-x: auto;
  padding: 0 20px;
}

.poker-card {
  width: 90px;
  height: 130px;
  background: #e0f7fa;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #134e4a;
  border: 2px solid #b2f7ef;
  transition: background 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s;
  position: relative;
  flex-shrink: 0;
  padding: 8px;
}

.poker-card.selected {
  background: #b2f7ef;
  border: 2.5px solid #17614a;
  box-shadow: 0 0 16px #17614a44;
  transform: scale(1.05);
}

.poker-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(44, 62, 80, 0.15);
}

.poker-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
  margin-bottom: 6px;
  border-radius: 6px;
}

.poker-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #134e4a;
  text-align: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 2.4em;
}

.emoji-game {
  background: linear-gradient(135deg, #81d4fa 0%, #ffe082 100%);
  color: #134e4a;
}

.hangman-slots {
  display: flex;
  gap: 1.2rem;
  margin: 32px 0 18px 0;
  justify-content: center;
}

.hangman-slot {
  width: 48px;
  height: 60px;
  border-bottom: 3px solid #17614a;
  font-size: 2.1rem;
  font-weight: 700;
  color: #17614a;
  text-align: center;
  background: #e0f7fa;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s, border 0.18s;
}

.hangman-slot.filled {
  background: #b2f7ef;
  border-bottom: 3px solid #468d8c;
}

.hangman-tiles {
  display: flex;
  gap: 1.2rem;
  margin: 18px 0 18px 0;
  justify-content: center;
}

.hangman-tile {
  width: 48px;
  height: 48px;
  background: #ffd600;
  color: #134e4a;
  font-size: 2rem;
  font-weight: 800;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  transition: background 0.18s, color 0.18s, opacity 0.18s;
}

.hangman-tile.used {
  background: #e0e0e0;
  color: #bdbdbd;
  cursor: not-allowed;
  opacity: 0.6;
}

.emoji-hint {
  font-size: 2.5rem;
  text-align: center;
  margin: 18px 0 0 0;
}

.emoji-error {
  color: #d32f2f;
  font-weight: 700;
  margin-top: 18px;
  font-size: 1.2rem;
}

.emoji-success {
  color: #388e3c;
  font-weight: 800;
  margin-top: 18px;
  font-size: 1.3rem;
}

.confetti {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
  animation: confetti-fall 2.2s linear;
  background: url('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/asset/emoji/confetti.png') center/cover no-repeat;
  opacity: 0.8;
}

@keyframes confetti-fall {
  0% {
    opacity: 0.8;
  }

  100% {
    opacity: 0;
  }
}

.dino-popup-inner {
  display: flex;
  align-items: flex-end;
  gap: 18px;
  margin-top: 32px;
}

.dino-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 0;
}

.dino-bubble {
  background: #90caf9;
  color: #134e4a;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 18px 24px;
  margin-left: 0;
  margin-bottom: 12px;
  min-width: 220px;
  box-shadow: 0 2px 8px #0001;
  position: relative;
}

.dino-bubble:before {
  content: '';
  position: absolute;
  left: -18px;
  bottom: 10px;
  width: 0;
  height: 0;
  border-top: 18px solid transparent;
  border-bottom: 18px solid transparent;
  border-right: 18px solid #90caf9;
}

.dino-loader {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #fff;
  border-top: 3px solid #17614a;
  border-radius: 50%;
  animation: dino-spin 1s linear infinite;
  margin-left: 12px;
  vertical-align: middle;
}

@keyframes dino-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.dino-cancel {
  background: #ffd600;
  color: #134e4a;
  border: none;
  border-radius: 8px;
  padding: 8px 22px;
  font-size: 1.1rem;
  font-weight: 700;
  margin-left: 12px;
  margin-bottom: 18px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0001;
  transition: background 0.18s;
}

.dino-cancel:hover {
  background: #ffe082;
}

.dino-countdown {
  font-size: 1.1rem;
  font-weight: 700;
  color: #17614a;
  margin-left: 2px;
}

/* Responsive design for poker cards */
@media (max-width: 1024px) {
  .game-modal {
    min-width: 700px;
    padding: 32px 20px;
  }
  
  .poker-cards {
    gap: 0.8rem;
    padding: 0 10px;
  }
  
  .poker-card {
    width: 80px;
    height: 120px;
    font-size: 0.8rem;
  }
  
  .poker-img {
    width: 40px;
    height: 40px;
  }
  
  .poker-name {
    font-size: 0.7rem;
  }
}

@media (max-width: 768px) {
  .game-modal {
    min-width: 90vw;
    padding: 24px 16px;
  }
  
  .poker-cards {
    gap: 0.6rem;
    padding: 0 5px;
  }
  
  .poker-card {
    width: 70px;
    height: 100px;
    padding: 4px;
  }
  
  .poker-img {
    width: 35px;
    height: 35px;
    margin-bottom: 4px;
  }
  
  .poker-name {
    font-size: 0.65rem;
    line-height: 1.1;
  }
}

@media (max-width: 480px) {
  .poker-cards {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }
  
  .poker-card {
    width: 65px;
    height: 90px;
  }
  
  .poker-img {
    width: 30px;
    height: 30px;
  }
  
  .poker-name {
    font-size: 0.6rem;
  }
  
  .game-title-split {
    gap: 3rem;
    margin-bottom: 2rem;
    flex-direction: column;
  }
  
  .title-text-left,
  .title-text-right {
    font-size: 1.8rem;
    margin-top: 20px;
  }
  
  .title-text-left span,
  .title-text-right span {
    margin-left: 0;
  }
  
  .dino-peek {
    height: 200px;
    margin-bottom: -40px;
  }
  
  .game-options {
    width: 95vw;
    max-width: 400px;
    padding: 20px;
  }
  
  .header {
    font-size: 24px;
    margin-top: 10px;
  }
  
  .content {
    flex-direction: column;
    gap: 20px;
  }
  
  .game-card {
    width: 150px;
    height: 150px;
    padding: 1.5rem 1rem;
    margin-bottom: 20px;
    margin-top: 15px;
  }
  
  .game-card p {
    font-size: 1.2rem;
  }
  
  .game-icon {
    width: 70px;
    height: 70px;
  }
  
  .game-modal {
    max-width: 95vw;
    max-height: 85vh;
    padding: 24px 16px;
    margin-top: 5px;
  }
  
  .game-modal h2 {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
  
  .spinner {
    max-width: 250px;
    max-height: 250px;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }
  
  .spin-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .result {
    font-size: 1.1rem;
    margin-top: 15px;
  }
  
  .emoji-hint {
    font-size: 2rem;
    margin: 12px 0 0 0;
  }
  
  .hangman-slots {
    gap: 0.8rem;
    margin: 20px 0 12px 0;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .hangman-slot {
    width: 35px;
    height: 45px;
    font-size: 1.6rem;
  }
  
  .hangman-tiles {
    gap: 0.8rem;
    margin: 12px 0 12px 0;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .hangman-tile {
    width: 35px;
    height: 35px;
    font-size: 1.5rem;
  }
  
  .dino-popup-inner {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
  }
  
  .dino-img {
    width: 60px;
    height: 60px;
  }
  
  .dino-bubble {
    font-size: 0.9rem;
    padding: 12px 16px;
    min-width: 180px;
    margin-bottom: 8px;
    text-align: center;
  }
  
  .dino-bubble:before {
    display: none;
  }
  
  .dino-cancel {
    font-size: 0.9rem;
    padding: 6px 16px;
    margin-left: 0;
    margin-bottom: 10px;
  }
}
</style>