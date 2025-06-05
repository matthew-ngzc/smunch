<script lang="js">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import OrderIcon from '@/assets/order-icon.png'
import RunIcon from '@/assets/run-icon.png'

export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter()
    const userName = 'sexy' // change it to be dynamic 

    const goToOrder = () => {
      router.push('/orders')
    }

    const goToRun = () => {
      router.push('/runners')
    }

    return { userName, OrderIcon, RunIcon, goToOrder, goToRun }
  }
})
</script>


<template>
  <div class="home">
    <h1>hi {{ userName }}, what would you like to do today?</h1>
    <div class="options">
      <div class="card order" @click="goToOrder">
        <img :src="OrderIcon" alt="order icon" class="icon" />
        <p>order with smunch!</p>
      </div>
      <div class="card run" @click="goToRun">
        <img :src="RunIcon" alt="run icon" class="icon" />
        <p>run with smunch!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  margin-top: 2rem;
}

.options {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  width: 250px;
  height: 250px;
  border-radius: 10px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.order {
  background-color: #5ea6c4;
  color: white;
}

.run {
  background-color: #468d8c;
  color: white;
}

.icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}
</style>