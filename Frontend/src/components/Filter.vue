<template>
  <div class="page">

    <div class="delivery-form-box">
      <h2>📍 where should your food be delivered?</h2>

      <div class="contents"> 

          <!-- filter dropdowns -->
        <div class="filters">
          <label>building</label>
          <select v-model="building">
            <option value="" disabled selected hidden>select</option>
            <option value="Business">School of Business</option>
            <option value="Law">School of Law</option>
            <option value="Economics">School of Economics</option>
            <option value="Accounting">School of Accounting</option>
            <option value="Scis1">School of Computing and Information Systems 1</option>
            <option value="Scis2">School of Computing and Information Systems 2</option>
          </select>
        </div>

        <!-- floor dropdown -->
        <div class="filters">
          <label>floor</label>
          <select v-model="floor">
            <option value="" disabled selected hidden>select</option>
            <option value="Level 2">2</option>
            <option value="Level 3">3</option>
            <option value="Level 4">4</option>
          </select>
        </div>

        <!-- facility type dropdown -->
        <div class="filters">
          <label>facility type</label>
          <select v-model="facilityType">
            <option value="" disabled selected hidden>select</option>
            <option value="Classroom">classroom</option>
            <option value="Group study room">group study room</option>
            <option value="Meeting pod">meeting pod</option>
            <option value="Seminar room">seminar room</option>
          </select>
        </div>

        <!-- date input -->
        <div class="filters">
          <label>date</label>
          <input type="date" v-model="date" />
        </div>

        <!-- time input -->
        <div class="filters">
          <label>time</label>
          <select  v-model="time">
            <option value="" disabled selected hidden>select</option>
            <option value="08:15 AM">08:15 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="03:30 PM">03:30 PM</option>
            <option value="07:00 PM">07:00 PM</option>
          </select>
        </div>
      </div>
     
      <div v-if="showValidationError" class="warning-banner">
        Please fill in all fields before proceeding.
      </div>

      <!-- next button -->
    <button class="next-btn" @click="goToSummary">next</button>

    </div>

  </div>
</template>

<script setup>


import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
// import { createOrder } from '@/services/orderFoodService' 
import { useDeliveryStore } from '@/stores/delivery'
import { storeToRefs } from 'pinia'
// import { useCartStore } from '@/stores/cart'
// import { useOrderStore } from '@/stores/order'
// import { useAuthStore } from '@/stores/auth'

const showValidationError = ref(false)
const router = useRouter()
const deliveryStore = useDeliveryStore()
const { building, floor, facilityType, date, time } = storeToRefs(deliveryStore)
// const cartStore = useCartStore()
// const orderStore = useOrderStore()
// const authStore = useAuthStore() 

// const building = ref('')
// const floor = ref('')
// const facilityType = ref('')
// const date = ref('')
// const time = ref('')

watchEffect(() => {
  if (building.value && floor.value && facilityType.value && date.value && time.value) {
    showValidationError.value = false
  }
})

async function goToSummary() {
  if (!building.value || !floor.value || !facilityType.value || !date.value || !time.value) {
    showValidationError.value = true
    return
  }

  showValidationError.value = false
  router.push('/summary') 
}

</script>


<style scoped>

/* the white card box for the form */
.delivery-form-box {
  max-width: 900px;                        /* limits width so it doesn't stretch too far */
  max-height: 700px;
  background-color: white !important;
  color: black;                                    
  padding: 40px;                                     
  border-radius: 16px;                                   /* rounded corners */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);        /* soft drop shadow */
  font-family: 'Inter', sans-serif; /* use inter font */
  text-align: left;             
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;

}

/* form title heading */
.delivery-form-box h2 {
  text-align: center;            /* center the heading */
  font-size: 2.2rem;             /* slightly large font */
  margin-bottom: 0.5rem;         /* spacing below heading */
  font-size: 36px;
  margin-top: 19px;
  margin-bottom: 11px;
  font-weight: bold;
}


.contents{
  padding: 35px;
}


/* each filter block */
.filters {
  display: flex;                
  flex-direction: column;
  margin-bottom: 7px;           /* space between each block */
  padding: 5px;                 /* spacing inside the box */
}

/* 🏷️ filter labels */
.filters label {
  display: block;
  font-weight: 600;              
  color: #444;                   
  margin-bottom: 6px;           
  text-transform: capitalize;  
  
}

.filters select,
.filters input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc; 
  border-radius: 8px;           
  font-size: 1rem;       
}


.next-btn {
  padding: 12px 24px;
  background-color: #007a3d;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  align-self: center;  /* to prevent button from stretching w parent */
}

/* hover effect for next button */
.next-btn:hover {
   background-color: #036232;
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