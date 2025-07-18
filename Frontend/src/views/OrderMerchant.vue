<script lang="js">
import { defineComponent, ref, onMounted, watch } from 'vue'
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
    const showEmptyCartWarning = ref(false)

    watch(quantities, (newQuantities) => {
      const hasItems = Object.values(newQuantities).some(qty => qty > 0)
      if (hasItems) showEmptyCartWarning.value = false
    }, { deep: true })

    const increase = (id) => {
      quantities.value[id] = (quantities.value[id] || 0) + 1
      if (showEmptyCartWarning.value) {
        const hasItems = Object.values(quantities.value).some(qty => qty > 0)
        if (hasItems) showEmptyCartWarning.value = false
      }
    }

    const decrease = (id) => {
      if (quantities.value[id] > 0) {
        quantities.value[id]--
        if (showEmptyCartWarning.value) {
          const hasItems = Object.values(quantities.value).some(qty => qty > 0)
          if (hasItems) showEmptyCartWarning.value = false
        }
      }
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

        // TO CREATE A NICE UI
        if (selectedItems.length === 0) {
          // alert('Your cart is empty. Please select at least one item before checking out.')
          showEmptyCartWarning.value = true
          return
        }
      cart.setCart(selectedItems)
      router.push({ name: 'cartPage' })  
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
      checkout,
      showEmptyCartWarning   
    }
  }
})
</script>


<template>
  <div class="merchant-page-wrapper">
  <div class="merchant-page">
    <div class="merchant-header">

      <div class="logo"> 
        <img :src="merchantInfo.image_url" alt="Merchant Logo" class="merchant-logo" />
      </div>

      <div class="texts">
        <p class="merchant-name"> {{ merchantInfo.name }} </p>
        <p class="location"> {{ merchantInfo.location }} </p>
      </div>
    
    </div>

    <hr />

    <div v-for="item in merchantMenu" :key="item.menu_item_id" class="menu-item">
      <img :src="item.image_url" class="menu-image" />
      <div class="menu-info">
        <h3>{{ item.name.toLowerCase() }}</h3>
        <p class="desc"> {{ item.description }} </p>
        <div class="menu-controls">
          <button @click="decrease(item.menu_item_id)">-</button>
          <span>{{ quantities[item.menu_item_id] }}</span>
          <button @click="increase(item.menu_item_id)">+</button>
        </div>
      </div>
      <div class="menu-price">${{ (item.price_cents / 100).toFixed(2) }}</div>
    </div>

    <div v-if="showEmptyCartWarning" class="warning-banner">
      Your cart is empty. Please select at least one item before checking out.
    </div>

    <button class="checkout-btn" @click="checkout">checkout</button>
    </div>
  </div>
</template>


<style scoped>
.merchant-page-wrapper {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
}

.merchant-page {
  padding: 20px;
  font-family: 'Inter', sans-serif;
  margin-top: 25px;
  width: 100%;
  max-width: 1200px;
}

.merchant-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  height: 9rem;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  gap: 12px;
}


.merchant-logo {
  height: 80px;
  margin-right: 20px;
  margin-left: 10px;
  width: 100px;
}

.texts {
  display: flex;
  flex-direction: column;
}

.merchant-name {
  font-weight: bold;
  font-size: 27px;
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
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-controls button {
  background-color: #30895f;
  display:flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 30px;
  width: 20px;
  height: 20px;
  font-size: 16px;
  cursor: pointer;
  color: white;
}

.menu-controls button:hover {
  box-shadow: 1px 1px 2px #848383;

}

.menu-controls span { /* to prevent the number from moving the buttons */
  display: inline-block;
  width: 2.5ch;       /* enough for 2–3 digits */
  text-align: center;
  flex: 0 0 auto;
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
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

.warning-banner {
  background-color: #ffe6e6;
  color: #b30000;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: 500;
  border: 1px solid #ffb3b3;
}

</style>