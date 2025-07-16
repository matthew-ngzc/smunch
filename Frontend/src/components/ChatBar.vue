<template>
  <div>
    <!-- Floating Toggle Button -->
    <div class="toggle-button-container">
      <button
        @click="toggleCollapse"
        :title="isCollapsed ? 'Expand chat' : 'Collapse chat'"
        class="toggle-button"
      >
        <div class="glow-layer"></div>
        <div class="icon-layer">
          <svg v-if="isCollapsed" class="icon-svg" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707
                 m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014
                 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <svg v-else class="icon-svg" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div v-if="messages.length > 1" class="notification-dot"></div>
      </button>
    </div>

    <!-- Chat UI -->
    <div class="chat-container">
      <transition name="chat-fade-scale">
        <div v-show="!isCollapsed" class="chat-content">
          <!-- Header -->
          <div class="chat-header">
            <div class="header-left">
              <div class="avatar-container">
                <div class="avatar"></div>
                <div class="online-dot"></div>
              </div>
              <div>
                <h2>Smunch AI</h2>
                <p v-if="isResponseActive" class="timer mono">Response time: {{ formatTime(currentResponseTime) }}</p>
                <p v-if="responseTimes.length" class="avg mono">Avg response: {{ formatResponseTime(avgResponse) }}</p>
              </div>
            </div>
            <button @click="toggleCollapse" title="Collapse chat" class="close-button">
              <svg class="icon-svg" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Input Bar -->
          <div class="input-bar">
            <div class="input-wrapper">
              <input
                ref="inputRef"
                type="text"
                class="chat-input"
                placeholder="Let Smunch suggest what to eat..."
                v-model="input"
                @keydown.enter.prevent="sendMessage"
              />
              <div class="underline"></div>
            </div>
            <button
              @click="sendMessage"
              :disabled="!input.trim()"
              class="send-button"
            >
              <span class="send-text">Send</span>
              <div class="btn-glow"></div>
            </button>
          </div>

          <!-- Chat History -->
          <div class="chat-history">
            <div v-for="(msg, i) in messages" :key="i"
              :class="['message-row', msg.sender === 'user' ? 'align-right' : 'align-left']">
              <div :class="['message-bubble', msg.sender === 'user' ? 'user-bubble' : 'bot-bubble']"
                v-html="msg.sender === 'bot' ? formatBotReply(msg.text) : msg.text"></div>
            </div>
            <div v-if="isTyping" class="message-row align-left">
              <div class="typing-bubble">
                <div class="dot" v-for="n in 3" :key="n" :style="{ animationDelay: `${(n-1)*150}ms` }"></div>
              </div>
            </div>
            <div ref="messagesEndRef"></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, onUnmounted, computed } from 'vue';

const WEBHOOK_URL = 'http://localhost:5678/webhook/0a02177a-63bb-4ff9-bc1a-119b4a92331c'

const messages = reactive([
  { sender: 'bot', text: 'Hi there! I am Smunch. How can I assist you today?' }
]);
const input = ref('');
const isCollapsed = ref(true);
const isTyping = ref(false);
const isResponseActive = ref(false);
const currentResponseTime = ref(0);
const responseTimes = ref([]);

// Emit collapsed state to parent components
const emit = defineEmits(['chatStateChange']);
watch(isCollapsed, (newValue) => {
  emit('chatStateChange', !newValue);
});

const messagesEndRef = ref(null);
const inputRef = ref(null);

const scrollToBottom = () => {
  nextTick(() => messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' }));
};

watch(messages, scrollToBottom);

let timerInterval = null;
watch(isResponseActive, val => {
  if (val) {
    timerInterval = setInterval(() => currentResponseTime.value++, 1000);
  } else {
    clearInterval(timerInterval);
  }
});

const formatTime = sec => {
  const h = Math.floor(sec / 3600),
        m = Math.floor((sec % 3600) / 60),
        s = sec % 60;
  if (h) return `${h}h ${m}m ${s}s`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
};

const formatResponseTime = ms => {
  const s = Math.floor(ms / 1000);
  const msec = ms % 1000;
  return `${s}.${msec.toString().padStart(3, '0')}s`;
};

const avgResponse = computed(() => {
  const sum = responseTimes.value.reduce((a, b) => a + b, 0);
  return responseTimes.value.length ? sum / responseTimes.value.length : 0;
});

onMounted(() => {
  document.addEventListener('keydown', handleHotkey);
});
const handleHotkey = e => {
  if ((e.ctrlKey||e.metaKey) && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    toggleCollapse();
    if (isCollapsed.value) setTimeout(() => inputRef.value?.focus(), 300);
  }
};
onUnmounted(() => {
  document.removeEventListener('keydown', handleHotkey);
});

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  if (!isCollapsed.value) setTimeout(() => inputRef.value?.focus(), 300);
}

function formatBotReply(text) {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

async function sendMessage() {
  if (!input.value.trim()) return;
  isResponseActive.value = true;
  currentResponseTime.value = 0;
  messages.push({ sender: 'user', text: input.value });
  isTyping.value = true;
  const start = Date.now();

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chatInput: input.value })
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    const reply = data.reply || "Sorry, I didn't get that.";
    messages.push({ sender:'bot', text: reply });
  } catch {
    messages.push({ sender: 'bot', text: '⚠️ Something went wrong.' });
  }

  responseTimes.value.push(Date.now() - start);
  input.value = '';
  isTyping.value = false;
  isResponseActive.value = false;
}
</script>

<style scoped>
/* Layout */
.chat-container {
  position: fixed;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 768px;
  z-index: 999;
  padding: 0 1rem;
  box-sizing: border-box;
}

.chat-content {
  transition: all 0.5s ease;
}

.chat-fade-scale-enter-active,
.chat-fade-scale-leave-active {
  transition: all 0.5s ease;
}

.chat-fade-scale-enter-from,
.chat-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1000;
}

.header-left {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 60px;
  height: 60px;
  background: url('/dinoSMUNCHING.png') center/cover;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .online-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  background-color: #343836;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
} */

/* Header text */
h2 {
  margin: 0.5;
  font-size: 3 rem;
  font-weight: 600;
  color: #f3fbf4;
}

p {
  margin: 0;
  font-size: 0.85rem;
  color: #0f312f;
}

.timer,
.avg {
  font-size: 0.75rem;
  margin-top: 2px;
}

.mono {
  font-family: monospace;
}

/* Input Bar */
.input-bar {
  background: rgb(254, 254, 254);
  backdrop-filter: blur(6px);
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.input-wrapper {
  position: relative;
  flex-grow: 1;
}

.chat-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  color: #374151;
}

.chat-input::placeholder {
  color: #cccccc;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(to right, #10b981, #059669);
  transition: width 0.3s;
}

.input-wrapper:hover .underline {
  width: 100%;
}

/* Send Button */
.send-button {
  position: relative;
  background: linear-gradient(to right, #10b981, #059669);
  color: rgb(255, 255, 255);
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
}

.send-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.send-button:disabled {
  background: linear-gradient(to right, #10b981, #059669);
  cursor: not-allowed;
  transform: none;
}

.send-text {
  position: relative;
  z-index: 10;
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #22c55e, #16a34a);
  opacity: 0;
  border-radius: 0.75rem;
  transition: opacity 0.3s;
  z-index: 1;
}

.send-button:hover .btn-glow {
  opacity: 1;
}

/* Chat History */
.chat-history {
  margin-top: 1rem;
  max-height: 24rem;
  overflow-y: auto;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.message-row {
  display: flex;
  margin-bottom: 0.75rem;
}

.align-right {
  justify-content: flex-end;
}

.align-left {
  justify-content: flex-start;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  max-width: 80%;
  font-size: 0.95rem;
  transition: box-shadow 0.2s;
}

.user-bubble {
  background: linear-gradient(to right, #10b981, #059669);
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.bot-bubble {
  background: #f9fafb;
  color: #134e4a;
  border: 1px solid #e5e7eb;
}

.message-bubble:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Typing Indicator */
.typing-bubble {
  display: flex;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  align-items: center;
}

.typing-bubble .dot {
  width: 8px;
  height: 8px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: bounce 1s infinite;
}

.typing-bubble .dot:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-bubble .dot:nth-child(3) {
  animation-delay: 0.3s;
}

/* Floating Toggle Button */
.toggle-button-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
}

.toggle-button {
  position: relative;
  background: linear-gradient(to right, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  overflow: hidden;
}

.toggle-button:hover {
  transform: scale(1.1) rotate(3deg);
}

.glow-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #22c55e, #16a34a);
  opacity: 0;
  border-radius: 9999px;
  animation: pulse 2s infinite;
}

.icon-layer {
  position: relative;
  z-index: 10;
}

.icon-svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
}

.notification-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  background-color: #ef4444;
  border-radius: 9999px;
  animation: ping 1s infinite;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background 0.2s;
}

.close-button:hover {
  background: #f3f4f6;
}

/* Animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  75% {
    transform: scale(2.5);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>