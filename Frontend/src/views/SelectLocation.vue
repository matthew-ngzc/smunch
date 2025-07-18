<script setup>
import ordertimeline from '../components/OrderTimeline.vue'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useDeliveryStore } from '@/stores/delivery'
import { storeToRefs } from 'pinia'
import { locationMap } from '@/components/locationMap.js'

// Progress timeline
const data = {
  steps: ['order details', 'delivery location', 'order confirmation', 'payment'],
  currentStep: 2,
  activeColor: 'rgb(0, 0, 0)',
  passiveColor: 'grey',
}

// Delivery logic
const showValidationError = ref(false)
const router = useRouter()
const deliveryStore = useDeliveryStore()
const { building, floor, facilityType, date, time } = storeToRefs(deliveryStore)
const roomNumber = ref(deliveryStore.roomNumber)


const buildingError = ref('')
const floorError = ref('')
const facilityError = ref('')
const roomNumberError = ref('')

// for facility type
watchEffect(() => {
  if (!building.value || !floor.value || !facilityType.value) return

  const normalisedMap = {
    business: 'LKCSB',
    law: 'YPHSL',
    economics: 'SOA',
    accounting: 'SOA',
    scis1: 'SCIS1',
    scis2: 'SCIS2'
  }

  const normalisedBuilding = normalisedMap[building.value?.toLowerCase()]
  const extractedFloor = floor.value?.match(/\d+/)?.[0]

  const map = locationMap[normalisedBuilding]
  const validFacilities = map?.floors?.[extractedFloor]
    ? Object.keys(map.floors[extractedFloor]).map(f => f.toLowerCase())
    : []

  if (!validFacilities.includes(facilityType.value.toLowerCase())) {
    facilityError.value = 'invalid facility type for selected building and floor.'
  } else {
    facilityError.value = ''
  }
})


// Auto-fill room number when floor is chosen
watchEffect(() => {
  if (floor.value) {
    const match = floor.value.match(/Level (\d+)/)
    if (match) {
      roomNumber.value = `${match[1]}-`
      roomNumberError.value = ''
    }
  }
})

// for room number
watchEffect(() => {
  if (!roomNumber.value) {
    roomNumberError.value = ''
    return
  }

  const roomNumberPattern = /^\d+-\d+$/
  const matchesPattern = roomNumberPattern.test(roomNumber.value.trim())
  const isValid = validateRoomNumber(building.value, floor.value, facilityType.value, roomNumber.value)

  if (!matchesPattern) {
    roomNumberError.value = 'room format must be like 2-3 or 4-1'
  } else if (!isValid) {
    roomNumberError.value = 'invalid room number for selected building/floor/facility.'
  } else {
    roomNumberError.value = ''
  }
})

// for floor
watchEffect(() => {
  if (!building.value || !floor.value) {
    floorError.value = ''
    return
  }

  const normalisedMap = {
    business: 'LKCSB',
    law: 'YPHSL',
    economics: 'SOA',
    accounting: 'SOA',
    scis1: 'SCIS1',
    scis2: 'SCIS2'
  }

  const normalisedBuilding = normalisedMap[building.value?.toLowerCase()]
  const extractedFloor = floor.value?.match(/\d+/)?.[0] // "Level 3" -> "3"

  const map = locationMap[normalisedBuilding]
  const validFloors = map?.floors ? Object.keys(map.floors) : []

  if (!validFloors.includes(extractedFloor)) {
    floorError.value = 'invalid floor for selected building.'
  } else {
    floorError.value = ''
  }
})


function validateRoomNumber(buildingVal, floorVal, facilityVal, roomVal) {
  // convert all keys to lowercase for safe matching
  const normalisedMap = {
    business: "LKCSB",
    law: "YPHSL",
    economics: "SOA",
    accounting: "SOA",
    scis1: "SCIS1",
    scis2: "SCIS2",
  }

  const normalisedBuilding = normalisedMap[buildingVal?.toLowerCase()]
  const extractedFloor = floorVal?.match(/\d+/)?.[0] // "Level 3" -> "3"

  if (!normalisedBuilding || !extractedFloor || !facilityVal || !roomVal) {
    return false // missing data
  }

  const map = locationMap[normalisedBuilding]
  if (!map) return false

  const facilityKey = Object.keys(map.floors[extractedFloor] || {}).find(fac => fac.toLowerCase() === facilityVal.toLowerCase())
  if (!facilityKey) return false

  const validRooms = map.floors[extractedFloor][facilityKey] || []
  return validRooms.includes(roomVal.trim())
}


async function goToSummary() {
  if (!building.value || !floor.value || !facilityType.value || !date.value || !time.value || !roomNumber.value) {
    showValidationError.value = true
    return
  }

  const isRoomValid = validateRoomNumber(building.value, floor.value, facilityType.value, roomNumber.value)

if (!isRoomValid) {
  // full validation with specific field errors
  buildingError.value = ''
  floorError.value = ''
  facilityError.value = ''
  roomNumberError.value = ''

  const normalisedMap = {
    business: 'LKCSB',
    law: 'YPHSL',
    economics: 'SOA',
    accounting: 'SOA',
    scis1: 'SCIS1',
    scis2: 'SCIS2'
  }

  const normalisedBuilding = normalisedMap[building.value?.toLowerCase()]
  const extractedFloor = floor.value?.match(/\d+/)?.[0]

  if (!normalisedBuilding || !locationMap[normalisedBuilding]) {
    buildingError.value = 'Invalid building selected.'
  } else if (!extractedFloor || !locationMap[normalisedBuilding].floors[extractedFloor]) {
    floorError.value = 'Invalid floor for this building.'
  } else if (!locationMap[normalisedBuilding].floors[extractedFloor][facilityType.value]) {
    facilityError.value = 'Invalid facility for this floor.'
  } else {
    roomNumberError.value = 'Invalid room number for selected building/floor/facility.'
  }

  return
}



  // success
  showValidationError.value = false
  roomNumberError.value = ''
  deliveryStore.roomNumber = roomNumber.value
  router.push('/summary')
}


// Back button functionality
function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="select-location-page-wrapper">
  <div class="select-location-page">
    <ordertimeline :data="data" />

      <div class="delivery-form-container">
        <div class="back-button" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="form-header">
          <div class="header-accent"></div>
          <h2>Delivery Location</h2>
          <p class="header-subtitle">Where should we deliver your order?</p>
        </div>

        <div class="form-grid">
          <!-- Building Selection -->
          <div class="form-section">
            <label>Building</label>
            <div class="select-wrapper">
              <select v-model="building" class="modern-select">
                <option value="" disabled selected hidden>Select building</option>
            <option value="Business">School of Business</option>
            <option value="Law">School of Law</option>
            <option value="Economics">School of Economics</option>
            <option value="Accounting">School of Accounting</option>
            <option value="Scis1">School of Computing and Information Systems 1</option>
            <option value="Scis2">School of Computing and Information Systems 2</option>
          </select>
              <div class="select-arrow"></div>
              <div v-if="buildingError" class="error-message">{{ buildingError }}</div>
            </div>
        </div>

          <!-- Floor Selection -->
          <div class="form-section">
            <label>Floor</label>
            <div class="select-wrapper">
              <select v-model="floor" class="modern-select">
                <option value="" disabled selected hidden>Select floor</option>
                <option value="Level 1">Level 1</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 3">Level 3</option>
                <option value="Level 4">Level 4</option>
          </select>
              <div class="select-arrow"></div>
            </div>
            <div v-if="floorError" class="error-message">{{ floorError }}</div>
        </div>

          <!-- Room Number -->
          <div class="form-section">
            <label>Room Number</label>
            <div class="input-wrapper">
              <input 
                type="text" 
                v-model="roomNumber" 
                class="modern-input"
                placeholder="e.g. 2-2, 2-3"
              />
            </div>
            <div v-if="roomNumberError" class="error-message"> {{ roomNumberError }}
            </div>
        </div>

          <!-- Facility Type -->
          <div class="form-section">
            <label>Facility Type</label>
            <div class="select-wrapper">
              <select v-model="facilityType" class="modern-select">
                <option value="" disabled selected hidden>Select facility</option>
                <option value="Classroom">Classroom</option>
                <option value="Group study room">Group Study Room</option>
                <option value="Meeting pod">Meeting Pod</option>
                <option value="Seminar room">Seminar Room</option>
          </select>
              <div class="select-arrow"></div>
            </div>
            <div v-if="facilityError" class="error-message">{{ facilityError }}</div>
        </div>


          <!-- Date -->
          <div class="form-section">
            <label>Date</label>
            <div class="input-wrapper">
              <input 
                type="date" 
                v-model="date" 
                class="modern-input"
              />
            </div>
        </div>

          <!-- Time -->
          <div class="form-section">
            <label>Time</label>
            <div class="select-wrapper">
              <select v-model="time" class="modern-select">
                <option value="" disabled selected hidden>Select time</option>
            <option value="08:15 AM">08:15 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="03:30 PM">03:30 PM</option>
            <option value="07:00 PM">07:00 PM</option>
          </select>
              <div class="select-arrow"></div>
            </div>
          </div>
        </div>

        <!-- Validation Error -->
        <div v-if="showValidationError" class="validation-banner">
          <div class="banner-content">
            <h4>Please complete all fields</h4>
            <p>Fill in all the information above to continue</p>
        </div>
      </div>

        <!-- Next Button -->
        <div class="wrapper">
          <button class="next" @click="goToSummary">next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-location-page-wrapper {
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
}

.select-location-page {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.delivery-form-container {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s ease;
  z-index: 10;
}

.back-button:hover {
  background: #f7fafc;
  border-color: #38c172;
  color: #38c172;
  transform: scale(1.05);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.header-accent {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #38c172, #2f855a);
  margin: 0 auto 20px;
  border-radius: 2px;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
  font-weight: 400;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-section label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.select-wrapper, .input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.modern-select, .modern-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s ease;
  appearance: none;
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  font-weight: 500;
}

.modern-select:focus, .modern-input:focus {
  outline: none;
  border-color: #38c172;
  box-shadow: 0 0 0 3px rgba(56, 193, 114, 0.1);
  background: white;
}

.modern-select:hover, .modern-input:hover {
  border-color: #cbd5e0;
  background: #fafbfc;
}

.modern-input::placeholder {
  color: #a0aec0;
  font-weight: 400;
}

.select-arrow {
  position: absolute;
  right: 12px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #a0aec0;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.modern-select:focus + .select-arrow {
  transform: rotate(180deg);
  border-top-color: #38c172;
}

.error-message {
  color: #e53e3e;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 4px;
  padding: 6px 10px;
  background: rgba(229, 62, 62, 0.05);
  border-radius: 6px;
  border-left: 2px solid #e53e3e;
}

.validation-banner {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border: 1px solid #feb2b2;
  border-radius: 10px;
  padding: 16px;
  margin: 20px 0;
  animation: slideIn 0.3s ease-out;
}

.banner-content h4 {
  margin: 0 0 2px 0;
  color: #c53030;
  font-weight: 600;
  font-size: 0.9rem;
}

.banner-content p {
  margin: 0;
  color: #c53030;
  font-size: 0.8rem;
  opacity: 0.8;
}

.wrapper {
  display: flex;
  justify-content: center;
}

.next {
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

.next:hover {
  background-color: #036232;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .select-location-page {
    padding: 16px;
  }
  
  .delivery-form-container {
    padding: 24px;
    margin: 10px;
  }
  
  .form-header h2 {
    font-size: 1.6rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
}
}

@media (max-width: 480px) {
  .delivery-form-container {
    padding: 20px;
  }
  
  .form-header h2 {
    font-size: 1.4rem;
  }
  
  .form-grid {
    gap: 14px;
  }
  
  .modern-select, .modern-input {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
}
</style>
