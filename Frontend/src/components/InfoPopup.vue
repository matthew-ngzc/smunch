<template>
  <div class="info-container">
    <button class="info-btn" @click.stop="toggleInfo">
      <img src="/infoIcon.png" alt="info icon" class="info-icon" />
      <span>Order Status</span>
    </button>

    <div v-if="showInfo" class="info-popup" @click.stop>
      <h3>Order Status</h3>
      <div class="info-content">
        <div class="row" v-for="(status, index) in statusList" :key="index">
          <span class="dot" :class="status.color"></span>
          <span class="status-text">{{ status.label }}</span>
          <span class="status-desc">{{ status.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showInfo = ref(false)
function toggleInfo() {
  showInfo.value = !showInfo.value
}

const statusList = [
  { label: 'Refund pending', color: 'grey', description: 'Refund for an order has been filed' },
  { label: 'Refund completed', color: 'grey', description: 'Refund for an order has processed' },
  { label: 'Awaiting payment', color: 'grey', description: 'After an order is made' },
  { label: 'Awaiting verification', color: 'grey', description: 'After user makes payment' },
  { label: 'Payment confirmed', color: 'orange', description: 'Once payment has went through' },
  { label: 'Preparing', color: 'yellow', description: 'Merchant is preparing the order' },
  { label: 'Collected by runner', color: 'yellow', description: 'Runner has collected the food' },
  { label: 'Delivered', color: 'green', description: 'Food has been delivered by runner' },
  { label: 'Completed', color: 'green', description: 'Food has been received by user' },
  { label: 'Cancelled', color: 'red', description: 'Order has been cancelled by user' },
]

onMounted(() => {
  window.addEventListener('click', () => (showInfo.value = false))
})
</script>

<style scoped>
.info-container {
  position: relative;
}

.info-btn {
  background: white;
  border-radius: 20px;
  padding: 5px 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  border: 1px solid rgb(103, 98, 98);
}

.info-icon {
  width: 20px;
  height: 20px;
}

.info-popup {
  position: absolute;
  top: 45px;
  right: 0;
  transform: translateX(10%);
  width: 460px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 20px;
  z-index: 99;
  width: 470px;
}

.info-popup h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.row {
  display: grid;
  grid-template-columns: 16px 173px 1fr;
  align-items: center;
  gap: 12px;
  line-height: 1.3;
  padding: 2px 0;
}


.dot {
  width: 10px;
  height: 10px;
  min-width: 10px;
  min-height: 10px;
  aspect-ratio: 1 / 1; /* forces it to always be a square */
  border-radius: 50%;
  background-color: gray;
  align-self: center;
  justify-self: start;
}




.status-text {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-desc {
  font-size: 13px;
  color: #444;
}

.grey { background-color: #555; }
.orange { background-color: orange; }
.yellow { background-color: gold; }
.green { background-color: green; }
.red { background-color: rgb(206, 60, 23); }
</style>