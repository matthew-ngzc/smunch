<script lang="js">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import OrderIcon from '@/assets/order-icon.png'
import RunIcon from '@/assets/run-icon.png'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter()
    const auth = useAuthStore()
    const userName = auth.userName 
    const goToOrder = () => { router.push('/order') }
    const goToRun = () => { router.push('/run') }
    return { userName, OrderIcon, RunIcon, goToOrder, goToRun }
  }
})
</script>

<template>
  <div class="home no-scroll">
    <div class="home-content">
      <h1 class="greeting">Hi {{ userName || 'sexy' }}, what would you like to do today?</h1>
      <div class="options">
        <div class="card order" @click="goToOrder">
          <img :src="OrderIcon" alt="order icon" class="icon" />
          <p>Order with SMUNCH!</p>
        </div>
        <div class="card run" @click="goToRun">
          <img :src="RunIcon" alt="run icon" class="icon" />
          <p>Run with SMUNCH!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }
.home.no-scroll {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.home-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}
.greeting {
  font-size: 2.6rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 2.5rem;
  text-align: center;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}
.options {
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: center;
}
.card {
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
.card:hover {
  transform: translateY(-10px) scale(1.04);
  box-shadow: 0 16px 48px rgba(44, 62, 80, 0.18);
  background: #e0f2f1;
}
.order {
  background: linear-gradient(135deg, #5ea6c4 0%, #b2f7ef 100%);
  color: #134e4a;
}
.run {
  background: linear-gradient(135deg, #468d8c 0%, #b2f7ef 100%);
  color: #134e4a;
}
.icon {
  width: 72px;
  height: 72px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 2px 8px rgba(44, 62, 80, 0.10));
}
.card p {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
}
@media (max-width: 900px) {
  .options {
    flex-direction: column;
    gap: 2rem;
  }
  .card {
    width: 90vw;
    max-width: 350px;
    height: 200px;
    padding: 1.5rem 1rem;
  }
}
</style>