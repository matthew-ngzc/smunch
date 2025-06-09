<script setup>
  // import { defineProps } from 'vue';

  const props = defineProps({
    data: Object,
  });

  props.data.currentStep--;

  const data =red(props.data);

  const cssStyle = computed(() => {
    return {
      '--active-color': data.value.activeColor,
      '--passive-color' : data.value.passiveColor,
    };
  }

)

</script>



<template>
  
  <div class="steps-container"> :style="cssStyle"
    <ul class="steps-list"> 
       <li class="step" v-for="(step, index) in data.steps"
         :key="index" :class="(index == data.currentStep)? 
         'step-active' : '' (index < data.currentStep)?
         'step-done' : '' ">
          <div class="step-bubble"></div>
              <div class="step-line">
                <div class="line-fill"> </div>
              </div>
       </li> 
    </ul>
  </div>
</template>


<style scoped>
  .steps-container {
    width: 100%;
    margin: 0 auto;
  }

  .steps-list {
    display: flex;
    list-style: none;
  }

  .step{
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 100%;
    position: relative;
    height: 60px;
  }

  .step:last-child {
    max-width: 60px;
  }

  .step-bubble {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: var(--passive-color);
    transition: all .3s ease;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }

  .step-line {
    width: 100%;
    height: 5px;
     background-color: var(--passive-color);
     position: absolute;
     top: 50%;
     left: 0;
     transform: translateY(-50%);
     z-index: -10;
  }

  .line

  .step:last-child .step-line {
    display: none;
  }

  .step-active .step-bubble {
    color: black;
  }

  .step-done .step-bubble {
    color: black;
  }

</style>


