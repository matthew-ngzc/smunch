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
  <div class="runner">
    <h1>This is the first runner page</h1>
    <p>Choose all the slots you want.</p>
    <p>blah blah blah</p>
  </div>
</template>

<style scoped>
.runner {
  text-align: center;
}
</style>
