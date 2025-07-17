<template>
  <div class="info-container">
    <div 
      class="info-trigger" 
      @mouseenter="showInfo = true"
      @mouseleave="showInfo = false"
    >
      <img src="/infoIcon.png" alt="info icon" class="info-icon" />
      <span>Order Status</span>
    </div>

    <div v-if="showInfo" class="info-popup" @mouseenter="showInfo = true" @mouseleave="showInfo = false">
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
import { ref } from 'vue'

const showInfo = ref(false)

const statusList = [
  { label: 'Refund pending', color: 'grey', description: 'Refund for an order has been filed' },
  { label: 'Refund completed', color: 'grey', description: 'Refund for an order has processed' },
  { label: 'Awaiting payment', color: 'grey', description: 'An order is awaiting payment' },
  { label: 'Awaiting verification', color: 'grey', description: 'After user makes payment' },
  { label: 'Payment confirmed', color: 'orange', description: 'Payment for an order has processed' },
  { label: 'Preparing', color: 'yellow', description: 'Merchant is preparing the order' },
  { label: 'Collected by runner', color: 'yellow', description: 'Runner has collected the food' },
  { label: 'Delivered', color: 'green', description: 'Food has been delivered by runner' },
  { label: 'Completed', color: 'green', description: 'Food has been received by user' },
  { label: 'Cancelled', color: 'red', description: 'Users order has been cancelled' },
]
</script>

<style scoped>
.info-container {
  position: relative;
}

.info-trigger {
  background: white;
  border-radius: 20px;
  padding: 5px 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  border: 1px solid rgb(103, 98, 98);
  transition: all 0.2s ease;
}

.info-trigger:hover {
  background: #f8f9fa;
  border-color: #6c757d;
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
  width: 466px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 20px;
  z-index: 99;
  width: 470px;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(10%) translateY(0);
  }
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
  white-space: nowrap;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.3;
  padding: 2px 0;
  position: relative;
}

.dot {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: gray;
  display: inline-block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  line-height: 1;
  vertical-align: middle;
}

.status-text {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 0 173px;
}

.status-desc {
  font-size: 13px;
  color: #444;
  flex: 1;
}

.grey { background-color: #555; }
.orange { background-color: orange; }
.yellow { background-color: gold; }
.green { background-color: green; }
.red { background-color: rgb(206, 60, 23); }
</style>