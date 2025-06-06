<template>
  <div class="page">

    <div class="delivery-form-box">
      <h2>📍 where should your food be delivered?</h2>

      <!-- filter dropdowns -->
      <div class="filters">
        <label>building</label>
        <select v-model="building">
          <option value="" disabled selected hidden>select</option>
          <option value="business">school of business</option>
          <option value="law">school of law</option>
          <option value="economics">school of economics</option>
          <option value="accounting">school of accounting</option>
          <option value="scis1">school of computing and information systems 1</option>
          <option value="scis2">school of computing and information systems 2</option>
        </select>
      </div>

      <!-- floor dropdown -->
      <div class="filters">
        <label>floor</label>
        <select v-model="floor">
          <option value="" disabled selected hidden>select</option>
          <option value="level2">2</option>
          <option value="level3">3</option>
          <option value="level4">4</option>
        </select>
      </div>

      <!-- facility type dropdown -->
      <div class="filters">
        <label>facility type</label>
        <select v-model="facilityType">
          <option value="" disabled selected hidden>select</option>
          <option value="classroom">classroom</option>
          <option value="gsr">group study room</option>
          <option value="meeting-pod">meeting pod</option>
          <option value="sr">seminar room</option>
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
          <option value="afternoon-slot">12:00 PM</option>
        </select>
      </div>
      <!-- <div class="filters">
        <label>time</label>
        <input type="time" />
      </div> -->

      <!-- next button -->
    <button class="next-btn" @click="goToSummary">next</button>

    </div>

  </div>
</template>

<script setup>


import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDeliveryStore } from '@/stores/delivery'

const router = useRouter()
const deliveryStore = useDeliveryStore()

const building = ref('')
const floor = ref('')
const facilityType = ref('')
const date = ref('')
const time = ref('')



function goToSummary() {
  deliveryStore.setDeliveryInfo({
    building: building.value,
    floor: floor.value,
    facilityType: facilityType.value,
    date: date.value,
    time: time.value
  })
  router.push('/summary')
}
</script>


<style scoped>

/* the white card box for the form */
.delivery-form-box {
  max-width: 900px;                        /* limits width so it doesn't stretch too far */
  max-height: 800px;
  margin: 100px auto;                        /* vertical spacing + center horizontally */
  background-color: white !important;
  color: black;                                    
  padding: 40px;                                     
  border-radius: 16px;                                   /* rounded corners */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);        /* soft drop shadow */
  font-family: 'Inter', sans-serif; /* use inter font */
  text-align: left;              
}

/* form title heading */
.delivery-form-box h2 {
  text-align: center;            /* center the heading */
  font-size: 2.2rem;             /* slightly large font */
  margin-bottom: 0.5rem;         /* spacing below heading */
}

/* subtitle */
.subtext {
  text-align: center;         
  font-size: 1.1rem;            
  margin-bottom: 2rem;           /* space before first field */
}

/* each filter block */
.filters {
  display: flex;                
  flex-direction: column;
  margin-bottom: 24px;           /* space between each block */
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



/* "next" button styling */
.next-btn {
  width: 100%; 
  padding: 12px; 
  background-color: #077a6e; 
  color: white; 
  font-weight: bold;
  border: none; 
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease; 
}

/* hover effect for next button */
.next-btn:hover {
  background-color: #055f57; /* slightly darker green on hover */
}
</style>