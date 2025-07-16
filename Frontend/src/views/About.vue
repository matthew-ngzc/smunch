<template>
  <div class="home no-scroll">
    <button class="back-btn" @click="$router.push('/')">
      <span class="arrow">&#8592;</span> Back
    </button>
    <div class="home-content">
      <div class="header-section">
        <h1 class="greeting">About Us</h1>
        <p class="subtitle">Connecting students, one delivery at a time</p>
      </div>
      
      <div class="about-container">
        <div class="mission-card">
          <div class="card-icon">🎯</div>
          <h2>Our Mission</h2>
          <p>SMUNCH was created by students, for students, to make campus life easier and more connected. Our mission is to help students save time, earn money, and build community by making food delivery on campus simple and accessible.</p>
        </div>
        
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">🤝</div>
            <h3>Community</h3>
            <p>We believe in empowering students to help each other, whether it's by delivering food or making new friends along the way.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">💰</div>
            <h3>Opportunity</h3>
            <p>Earn money by becoming a runner and helping fellow students while building your network.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">⚡</div>
            <h3>Efficiency</h3>
            <p>Save time and energy with quick, reliable food delivery right to your campus location.</p>
          </div>
        </div>
        
        <div class="join-section">
          <div class="join-card">
            <h2>Join the SMUNCH Community!</h2>
            <p>Be part of something bigger than just food delivery. Connect with fellow students, build lasting friendships, and make campus life more enjoyable for everyone.</p>
          </div>
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
  border-radius: 12px;
  padding: 0.8rem 1.4rem 0.8rem 1.2rem;
  font-size: 1.08rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(44,62,80,0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  box-shadow: 0 8px 32px rgba(44,62,80,0.25);
  transform: translateY(-2px);
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
    padding: 0.6rem 1rem 0.6rem 0.8rem;
  }
}

.home-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  margin-top: 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.greeting {
  font-size: 3rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}

.subtitle {
  font-size: 1.2rem;
  color: #468d8c;
  font-weight: 500;
  margin: 0;
}

.about-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.mission-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  transition: all 0.3s ease;
}

.mission-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(44, 62, 80, 0.18);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.mission-card h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #134e4a;
  margin-bottom: 1rem;
}

.mission-card p {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.7;
  margin: 0;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.value-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(44, 62, 80, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  background: rgba(255, 255, 255, 0.95);
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.value-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #134e4a;
  margin-bottom: 0.8rem;
}

.value-card p {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.join-section {
  margin-top: 1rem;
}

.join-card {
  background: linear-gradient(135deg, #5ea6c4 0%, #b2f7ef 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(94, 166, 196, 0.2);
  text-align: center;
  color: #134e4a;
  transition: all 0.3s ease;
}

.join-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(94, 166, 196, 0.3);
}

.join-card h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #134e4a;
}

.join-card p {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  color: #134e4a;
}

.join-features {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
}

.feature-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .home-content {
    padding: 1rem;
    margin-top: 1rem;
  }
  
  .greeting {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .mission-card,
  .join-card {
    padding: 2rem;
  }
  
  .value-card {
    padding: 1.5rem;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .join-features {
    align-items: flex-start;
  }
  
  .feature {
    justify-content: flex-start;
  }
}
</style> 