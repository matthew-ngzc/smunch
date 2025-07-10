<script lang="js">
import { defineComponent, onMounted, ref } from 'vue'
import { fetchAllMerchants } from '@/services/orderFoodService' 

export default defineComponent({
  setup() {
    const merchants = ref([])

    onMounted(async () => {
      try {
        // function to get merchants from backend
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
    </div>

    <hr class="divider" />

    <h2>order from</h2>

    <div class="merchant-list" v-if="merchants.length">
      <router-link
        v-for="merchant in merchants" :key="merchant.id" :to="{ name: 'orderMerchant', params: { id: merchant.merchant_id } }" class="merchant-card" >
        
        <div class="logo-wrapper">
          <img :src="merchant.image_url" alt="merchant logo" class="merchant-logo" />
        </div>
        
        <div class="text" >
          <h3>SMU {{ merchant.name }}</h3>
          <p>$1.00 delivery fee</p>
        </div>
        
      </router-link>
    </div>


    <div v-else>
      <p>Loading all merchants available...</p>
    </div>

    <div class="order-history">
      <h2>past orders</h2>

      <!-- !  to add cards of previous orders  -->
    </div>

  </div>

</template>


 <style scoped>
.order-page {
  padding: 30px;
  font-family: 'Inter', sans-serif;
}

.order-page h1 {
  margin-top: 30px;
}

.order-page h2 {
  margin-top: 60px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.search-bar input {
  flex: 1;
  padding: 10px 10px 10px 36px; /* space for the icon on the left */
  border-radius: 20px;
  border: 1px solid #ccc;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.48-5.34c-.59-2.93-3.22-5.1-6.23-5.1A6.49 6.49 0 0 0 3 10c0 3.58 2.92 6.5 6.5 6.5a6.5 6.5 0 0 0 4.65-1.93l.27.28v.79l5 5L20.49 19l-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 10px center;
}

.search-bar input:focus {
  outline: none;        /* remove dark border upon click */
  box-shadow: none;     
  border-color: #ccc;     
}

.divider {
  border: none;             
  height: 1px;               
  background-color: #524f4f;   
  margin: 40px 0 16px;        /* space above/below the line */
}

.merchant-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 40px;
  margin-top: 20px;
  overflow-x: auto;  /*enable scrolling*/
  overflow-y: hidden;
  max-width: 1200px;

}

.merchant-list::-webkit-scrollbar {
  display: none;
}

.merchant-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  min-width: 150px;
  height: 220px;
  text-align: center;
  box-shadow: 0 0 10px rgba(174, 172, 172, 0.2);
  display: flex;
  flex-direction: column;
  gap:10px;

}

.logo-wrapper {
  height: 100px !important;              /* fixed box for every logo */
  display: flex;
  align-items: center;        
  justify-content: center;   
   border-bottom: 1px solid #706a6a; 
  padding-bottom: 14px;    /* pushes the line down inside the wrapper */
  margin-bottom: 2px;     /* adds extra space between line and the <h3> */  
}

.merchant-logo {
  max-height: 100%;           /* fit inside the wrapper */
  max-width: 100%;
  object-fit: cover;   
}


.merchant-card h3 {
  font-size: 1rem;
  color: rgb(12, 92, 51);
}


.merchant-card p {
  font-size: 0.7rem;
  color: gray;
}
</style>
