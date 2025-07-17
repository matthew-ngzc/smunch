<template>
  <div class="home no-scroll">
    <button class="back-btn" @click="$router.push('/')">
      <span class="arrow">&#8592;</span> Back
    </button>
    <div class="home-content">
      <div class="header-section">
      <h1 class="greeting">Frequently Asked Questions</h1>
        <p class="subtitle">Everything you need to know about SMUNCH</p>
        </div>
      
      <div class="faq-container">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index" @click="toggleFaq(index)">
          <div class="faq-header" :class="{ 'active': activeFaq === index }">
            <h2>{{ faq.question }}</h2>
            <div class="faq-icon" :class="{ 'rotated': activeFaq === index }">
              <span>+</span>
        </div>
        </div>
          <div class="faq-content" :class="{ 'expanded': activeFaq === index }">
            <p>{{ faq.answer }}</p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeFaq = ref(null)

const faqs = ref([
  {
    question: "What is SMUNCH?",
    answer: "SMUNCH is a platform that connects students who want to order food with other students willing to deliver it on campus."
  },
  {
    question: "Can I use my SMU email with school name to sign up or log in?",
    answer: "No, you need to use your personal SMU email (without faculty name) to sign up or log in."
  },
  {
    question: "How do I become a runner?",
    answer: "This feature is currently unavailable but will be rolled out soon! Eventually, all users can become a runner. Sign up and select the 'Run' option in your Home Page. You can then accept delivery requests from other students."
  },
  {
    question: "How do I view the menu?",
    answer: "You can view the menu once you have logged in."
  },
  {
    question: "Is there a delivery fee?",
    answer: "Yes, a small delivery fee is charged to support the runners for their service. Delivery fee is fixed at SGD $1.00 per order."
  }
])

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}
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
  max-width: 800px;
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

.faq-container {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(44, 62, 80, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.faq-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  background: rgba(255, 255, 255, 0.95);
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  transition: all 0.3s ease;
}

.faq-header.active {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2f7ef 100%);
  border-bottom: 1px solid rgba(176, 247, 239, 0.3);
}

.faq-header h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #134e4a;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.faq-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5ea6c4 0%, #b2f7ef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #134e4a;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq-icon.rotated {
  transform: rotate(45deg);
  background: linear-gradient(135deg, #468d8c 0%, #5ea6c4 100%);
  color: white;
}

.faq-content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  padding: 0 2rem;
}

.faq-content.expanded {
  max-height: 200px;
  padding: 0 2rem 1.5rem 2rem;
}

.faq-content p {
  font-size: 1rem;
  color: #333;
  margin: 0;
  line-height: 1.6;
  opacity: 0;
  transition: opacity 0.3s ease 0.1s;
}

.faq-content.expanded p {
  opacity: 1;
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
  
  .faq-header {
    padding: 1.2rem 1.5rem;
  }
  
  .faq-header h2 {
    font-size: 1.1rem;
  }
  
  .faq-content {
    padding: 0 1.5rem;
  }
  
  .faq-content.expanded {
    padding: 0 1.5rem 1.2rem 1.5rem;
  }
}
</style> 