<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Runner',
  setup() {
    // No reactive logic yet, but setup function is ready
    return {}
  }
})
</script>

<template>
  <div class="page">
    <h2>coming soon!</h2>

  </div>
</template>



<style scoped>
.page {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: black;
  margin-top: 300px; /* pushes it down by 20px */
  margin-left: 460px;

}


.page h2 {
    font-size: 70px;
}



</style>