<template>
  <div class="home no-scroll">
    <button class="back-btn" @click="$router.push('/')">
      <span class="arrow">&#8592;</span> Back
    </button>
    <div class="home-content">
      <h1 class="greeting">Frequently Asked Questions</h1>
      <div class="faq-list">
        <div class="faq-item">
          <h2>What is SMUNCH?</h2>
          <p>SMUNCH is a platform that connects students who want to order food with other students willing to deliver it on campus.</p>
        </div>
        <div class="faq-item">
          <h2>Can I use my SMU email with school name to sign up or log in?</h2>
          <p>No, you need to use your personal SMU email (without school name) to sign up or log in.</p>
        </div>
        <div class="faq-item">
          <h2>How do I become a runner?</h2>
          <p>This feature is currently unavailable but will be rolled out soon! Eventually, all users can become a runner. Sign up and select the 'Run' option in your Home Page. You can then accept delivery requests from other students.</p>
        </div>
        <div class="faq-item">
          <h2>How do I view the menu?</h2>
          <p>You can view the menu once you have logged in</p>
        </div>
        <div class="faq-item">
          <h2>Is there a delivery fee?</h2>
          <p>Yes, a small delivery fee is charged to support the runners for their service. Delivery fee is fixed at SGD $1.00 per order.</p>
        </div>
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
.faq-list {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.faq-item h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #134e4a;
  margin-bottom: 0.5rem;
}
.faq-item p {
  font-size: 1.05rem;
  color: #333;
  margin: 0;
}
</style> 