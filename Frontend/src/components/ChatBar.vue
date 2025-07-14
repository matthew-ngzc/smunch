<template>
  <div class="chatbar-fixed-container">
    <!-- Input Bar -->
    <div class="chatbar-input-bar">
      <input
        v-model="input"
        @keypress.enter="sendMessage"
        type="text"
        class="chatbar-input"
        placeholder="Order with Smunchie..."
      />
      <button
        @click="sendMessage"
        class="chatbar-send-btn"
      >
        Send
      </button>
    </div>

    <!-- Chat History -->
    <div class="chatbar-history">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['chatbar-msg-row', msg.sender === 'user' ? 'chatbar-msg-row-user' : 'chatbar-msg-row-bot']"
      >
        <div
          :class="['chatbar-msg-bubble', msg.sender === 'user' ? 'chatbar-msg-user' : 'chatbar-msg-bot']"
        >
          {{ msg.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const WEBHOOK_URL = 'http://localhost:5678/webhook/80e14a8c-a59d-459b-aee2-55086cc5f3c2/chat';

const messages = ref([
  {
    sender: 'bot',
    text: 'Hi there! What would you like to order?'
  }
]);
const input = ref('');

const sendMessage = async () => {
  const trimmed = input.value.trim();
  if (!trimmed) return;

  messages.value.push({ sender: 'user', text: trimmed });

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed })
    });

    const data = await response.json();
    const reply = data?.reply || 'Sorry, I didn’t get that.';
    messages.value.push({ sender: 'bot', text: reply });
  } catch (e) {
    messages.value.push({ sender: 'bot', text: '⚠️ Something went wrong.' });
  }

  input.value = '';
};
</script>

<style scoped>
.chatbar-fixed-container {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  /* z-index: 1000; */   /* Turn this on to layer chat bar on top of other elements*/
  padding: 120px;
}

.chatbar-input-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 4px 24px 0 rgba(44,62,80,0.10), 0 2px 8px 0 rgba(143,79,255,0.10);
  padding: 0.75rem 1.5rem;
}

.chatbar-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  padding: 0 rem;
  color: #444;
}

.chatbar-input::placeholder {
  color: #d1d1d1;
  opacity: 1;
}

.chatbar-send-btn {
  margin-left: 0.75rem;
  background: #2fa36f;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.5rem 1.5rem;
  box-shadow: 0 2px 8px 0 rgba(143,79,255,0.10);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
}
.chatbar-send-btn:hover {
  background: #0d3d31;
  box-shadow: 0 4px 16px rgba(143,79,255,0.16);
}

.chatbar-history {
  margin-top: 0.5rem;
  max-height: 20rem;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px 0 rgba(44,62,80,0.10);
  padding: 1rem 1.2rem;
  backdrop-filter: blur(100px);
}

.chatbar-msg-row {
  display: flex;
  margin-bottom: 0.7rem;
}
.chatbar-msg-row-user {
  justify-content: flex-end;
}
.chatbar-msg-row-bot {
  justify-content: flex-start;
}

.chatbar-msg-bubble {
  max-width: 70%;
  padding: 0.5rem 0.7rem;
  font-size: 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 4px rgba(44,62,80,0.08);
  word-break: break-word;
  white-space: pre-wrap;
}
.chatbar-msg-user {
  background: #0d3d31;
  color: #fff;
  border-bottom-right-radius: 0.2rem;
}
.chatbar-msg-bot {
  background: #f3f4f6;
  color: #22223b;
  border-bottom-left-radius: 0.2rem;
}

/* Custom scrollbar for chat history */
.chatbar-history::-webkit-scrollbar {
  width: 8px;
  background: #f3f4f6;
}
.chatbar-history::-webkit-scrollbar-thumb {
  background: #0d3d31;
  border-radius: 8px;
}
</style>  