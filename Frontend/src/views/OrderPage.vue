<script lang="js">
import { defineComponent, onMounted, ref } from 'vue'
import { fetchAllMerchants } from '@/services/orderFoodService' 


export default defineComponent({
  setup() {
    const merchants = ref([])

    onMounted(async () => {
      try {
        const response = await fetchAllMerchants() // Adjust to your actual endpoint
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
  <h1>View All Merchants Page</h1>
  <div v-if="merchants.length">
    <div v-for="merchant in merchants" :key="merchant.id">
      <router-link :to="{ name: 'orderMerchant', params: { id: merchant.id } }">
        <h2>{{ merchant.title }}</h2>
      </router-link>
    </div>
  </div>
  <div v-else>
    <p>Loading all merchants available...</p>
  </div>
</template>

