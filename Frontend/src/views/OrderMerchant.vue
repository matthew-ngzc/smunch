<script lang="js">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMenuById, getMerchantInfoById } from '@/services/orderFoodService' 
import { useCartStore } from '@/stores/cart'


export default defineComponent({
  name: 'OrderMerchant',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const cart = useCartStore()
    const merchantId = route.params.id
    const merchantInfo = ref({})
    const merchantMenu = ref([])
    const quantities = ref({})

    const increase = (id) => {
      quantities.value[id] = (quantities.value[id] || 0) + 1
    }

    const decrease = (id) => {
      if (quantities.value[id] > 0) quantities.value[id]--
    }

    // this function is triggered when user presses the "checkout" button
    const checkout = () => {
    const selectedItems = merchantMenu.value
        .filter(item => quantities.value[item.menu_item_id] > 0)
        .map(item => ({
          id: item.menu_item_id,
          name: item.name,
          quantity: quantities.value[item.menu_item_id],
          price: item.price_cents / 100,
          image_url: item.image_url,
          merchant_id: merchantInfo.value.merchant_id,
          merchant_name: merchantInfo.value.name
        }))

      cart.setCart(selectedItems)
      router.push({ name: 'cartPage' })  // Make sure cartPage is a valid route
    }

    onMounted(async () => {
      try {
        const [menuRes, infoRes] = await Promise.all([
          getMenuById(merchantId),
          getMerchantInfoById(merchantId)
        ])
        merchantMenu.value = menuRes.data
        merchantInfo.value = infoRes.data

        // Initialize quantities
        merchantMenu.value.forEach(item => {
          quantities.value[item.menu_item_id] = 0
        })
      } catch (error) {
        console.error('Error loading merchant data:', error)
      }
    })

    return {
      merchantInfo,
      merchantMenu,
      quantities,
      increase,
      decrease,
      checkout
    }
  }
})
</script>
<template>
  <div class="merchant-page">
    <div class="merchant-header">
      <img :src="merchantInfo.image_url" alt="Merchant Logo" class="merchant-logo" />
    </div>

    <hr />

    <div v-for="item in merchantMenu" :key="item.menu_item_id" class="menu-item">
      <img :src="item.image_url" class="menu-image" />
      <div class="menu-info">
        <h3>{{ item.name.toLowerCase() }}</h3>
        <p class="desc">signature {{ item.type.includes('drink') ? 'coffee' : 'juice' }} with no added preservatives</p>
        <div class="menu-controls">
          <button @click="decrease(item.menu_item_id)">-</button>
          <span>{{ quantities[item.menu_item_id] }}</span>
          <button @click="increase(item.menu_item_id)">+</button>
        </div>
      </div>
      <div class="menu-price">${{ (item.price_cents / 100).toFixed(2) }}</div>
    </div>

    <button class="checkout-btn" @click="checkout">checkout</button>
  </div>
</template>


<style scoped>
.merchant-page {
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.merchant-header {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.merchant-logo {
  height: 60px;
  margin-right: 20px;
}

.address {
  font-weight: 500;
}

.rating {
  color: #555;
  margin-top: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fff;
}

.menu-image {
  height: 80px;
  width: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.menu-info {
  flex-grow: 1;
}

.menu-info h3 {
  margin: 0;
  text-transform: lowercase;
}

.desc {
  color: gray;
  font-size: 0.9rem;
}

.menu-controls {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-controls button {
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  font-size: 18px;
  cursor: pointer;
}

.menu-price {
  font-weight: bold;
  font-size: 1rem;
  min-width: 60px;
  text-align: right;
}

.checkout-btn {
  display: block;
  margin: 24px auto 0;
  padding: 12px 24px;
  background-color: #007a3d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>