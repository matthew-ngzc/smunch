<template>
  <div class="home no-scroll">
    <div class="home-content">
      <h1 class="greeting">About Us</h1>
      <div class="about-section">
        <p>SMUNCH was created by students, for students, to make campus life easier and more connected. Our mission is to help students save time, earn money, and build community by making food delivery on campus simple and accessible.</p>
        <p>We believe in empowering students to help each other, whether it's by delivering food or making new friends along the way. Join us and be part of the SMUNCH community!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// No special logic needed
</script>

<style scoped>
* { box-sizing: border-box; }
.home.no-scroll {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  margin: 0;
  padding: 0;
}
.home-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}
.greeting {
  font-size: 2.6rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 2.5rem;
  text-align: center;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}
.about-section {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.1rem;
  color: #134e4a;
  background: rgba(255,255,255,0.85);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
}
</style> 