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

      </div>
     

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
  padding: 89px;                                     
  border-radius: 16px;                                   /* rounded corners */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);        /* soft drop shadow */
  font-family: 'Inter', sans-serif; /* use inter font */
  text-align: left;       
  margin-top: 29px;      
}

/* form title heading */
.delivery-form-box h2 {
  text-align: center;            /* center the heading */
  font-size: 2.2rem;             /* slightly large font */
  margin-bottom: 0.5rem;         /* spacing below heading */
  font-size: 36px;
  margin-top: -30px;
  margin-bottom: 11px;
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
  display: block;
  margin: 24px auto 0;
  padding: 12px 24px;
  background-color: #007a3d;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
}

/* hover effect for next button */
.next-btn:hover {
   background-color: #036232;
}
</style>