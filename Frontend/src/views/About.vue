<template>
  <div class="home no-scroll">
    <button class="back-btn" @click="$router.push('/')">
      <span class="arrow">&#8592;</span> Back
    </button>
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
.back-btn {
  position: fixed;
  top: 150px;
  left: 100px;
  z-index: 1001;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem 0.6rem 1rem;
  font-size: 1.08rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(44,62,80,0.10);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.18s, box-shadow 0.18s;
}
.back-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  box-shadow: 0 8px 32px rgba(44,62,80,0.16);
}
.arrow {
  font-size: 1.2rem;
  margin-right: 0.2rem;
}
@media (max-width: 600px) {
  .back-btn {
    top: 140px;
    left: 60px;
    font-size: 0.98rem;
    padding: 0.5rem 0.9rem 0.5rem 0.7rem;
  }
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