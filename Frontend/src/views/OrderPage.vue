<script lang="js">
import { defineComponent, onMounted, ref } from 'vue'
import { fetchAllMerchants } from '@/services/orderFoodService' 

export default defineComponent({
  setup() {
    const merchants = ref([])

    onMounted(async () => {
      try {
        const response = await fetchAllMerchants() // Adjust to your actual endpoint
        console.log(response)
        merchants.value = response.data
      } catch (error) {
        console.error('Failed to load merchants:', error)
      }
    })

    return { merchants }
  }
})
</script>

<template>
  <div class="order-page">
    <h1>order something with SMUNCH!</h1>

    <!-- Search Bar -->
    <div class="search-bar">
      <input type="text" placeholder="search for shops..." />
      <span class="search-icon">🔍</span>
    </div>

    <h2>order from</h2>

    <div class="merchant-list" v-if="merchants.length">
      <div v-for="merchant in merchants" :key="merchant.id" class="merchant-card">
        <router-link :to="{ name: 'orderMerchant', params: { id: merchant.merchant_id } }">
          <!-- Use actual images if available -->
          <img :src="merchant.image_url" alt="merchant logo" class="merchant-logo" />
          <h3>smu {{ merchant.name }}</h3>
          <p>$1.00 delivery fee</p>
        </router-link>
      </div>
    </div>

    <div v-else>
      <p>Loading all merchants available...</p>
    </div>
  </div>
</template>


 <style scoped>
.order-page {
  padding: 30px;
  font-family: 'Inter', sans-serif;
}

.search-bar {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
}

.search-icon {
  margin-left: -30px;
  pointer-events: none;
}

.merchant-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.merchant-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  width: 180px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.merchant-logo {
  height: 60px;
  object-fit: contain;
  margin-bottom: 10px;
}

.merchant-card h3 {
  margin: 0;
  font-size: 1rem;
}

.merchant-card p {
  font-size: 0.9rem;
  color: gray;
}
</style>
