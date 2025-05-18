<script lang="js">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderById } from '@/services/orderFoodService' 

export default defineComponent({
  name: 'OrderMerchant',
  setup() {
    const route = useRoute()
    const merchant = ref(null)

    onMounted(async () => {
      const id = route.params.id
      console.log('merchant id:', id)

      try {
        const response = await getOrderById(id)
        merchant.value = response.data
      } catch (error) {
        console.error('Error fetching merchant:', error)
      }
    })

    return {
      merchant,
      route
    }
  }
})
</script>

<template>
  <div v-if="merchant">
    <h1>Merchant Order Page</h1>
    <p>This page is for the {{ merchant.title }}</p>
    <p>The merchant ID is {{ route.params.id }}</p>
    <p>The dynamic delivery fee for {{ merchant.title }} is ${{ merchant.dynamicDeliveryFee }}</p>
  </div>
  <div v-else>
    <p>Loading job details...</p>
  </div>
</template>

<style scoped>
/* Add styles here if needed */
</style>
