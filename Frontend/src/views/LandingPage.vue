<script lang="js">
import { defineComponent } from 'vue'
import deliveryManIcon from '@/assets/deliveryMan.png'

export default defineComponent({
  name: 'Home',
  setup() {
    // No reactive state or methods needed for now
    return {deliveryManIcon}
  }
})
</script>

<template>

  <!-- must wrap all root-level elements in a single container -->
      <!-- text -->
      <div class = "container"> 
      <div class="text-section">
        <h1 class="headline"> 
          <span class="welcome text">welcome to </span><br />
          <span class ="smunch!"> smunch! </span>
        </h1>
        <p>
          smunch connects hungry students with fellow students willing to deliver <br />
          food. no more missing meals due to tight class schedules!.
        </p>
        <button class="info-button">more info</button>
      </div>

      <!-- right side image -->
      <div class="image-section">
        <img :src="deliveryManIcon" class="bell" alt="bell" />
      </div>

    <!-- setting up routing to signing in -->
      <div> 
        <router-link to="/login" class="router-link-style">login</router-link>
        <router-link to="/signup" class="router-link-style">signup</router-link>
      </div>

      </div>
</template>


<style scoped>

.container {
  display: 100% ;
}


.text-section {
  flex: 1;
}

.text-section h1 {
  font-size: 2.8rem;
  color: #2c1e76;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.text-section p {
  font-size: 1rem;
  color: #333;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.info-button {
  background: linear-gradient(to right, #5c70ff, #729aff);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease;
}

.info-button:hover {
  opacity: 0.9;
}

.image-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.image-section img {
  max-width: 100%;
  height: auto;
}

.router-link-style {
  padding: 0.5rem 1.2rem;
  margin: 0 0.5rem;
  background-color: white;
  color: #006e52;
  border-radius: 999px; /* full round edges */
  text-decoration: none;
  font-weight: bold;
  border: 2px solid #006e52;
  transition: background-color 0.2s ease;
}

.router-link-style:hover {
  background-color: #006e52;
  color: white;
}

</style>
