<script setup>
import Filter from '@/components/Filter.vue' // Adjust path if needed
import ordertimeline from '../components/ordertimeline.vue'

   // progress timeline
    const data = {
      steps: [ 'order details', 'delivery location', 'order confirmation', 'payment'],
      currentStep: 2,
      activeColor: 'rgb(0, 0, 0)',
      passiveColor: 'grey',
    };



</script>

<template>
  <div class="select-location-page">

     <ordertimeline :data="data" :routes="routes" />
    <Filter />
  </div>
</template>


<style scoped>



</style>
