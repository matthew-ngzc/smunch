<template>
  <div class="home no-scroll">
    <button class="back-btn" @click="$router.push('/')">
      <span class="arrow">&#8592;</span> Back
    </button>
    <div class="home-content">
      <div class="header-section">
        <h1 class="greeting">Contact Us</h1>
        <p class="subtitle">We'd love to hear from you!</p>
      </div>
      
      <div class="contact-card">
        <div class="card-header">
          <div class="header-text">
            <!-- <h2>Get in Touch</h2> -->
            <p>If you have any questions, feedback, or need support, feel free to reach out to us!</p>
          </div>
        </div>
        
        <div class="contact-content">
          <div class="contact-info">
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-text">
                <h3>Email</h3>
                <a href="mailto:smunch.dev@gmail.com">smunch.dev@gmail.com</a>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">📍</div>
              <div class="info-text">
                <h3>Location</h3>
                <p>SMU Campus</p>
              </div>
            </div>
          </div>
          
          <div class="contact-form">
            <h3 class="form-title">Send us a Message</h3>
            
            <form @submit.prevent="handleSubmit">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Your Name</label>
                  <input 
                    id="name"
                    type="text" 
                    placeholder="Enter your name" 
                    v-model="name" 
                    required 
                  />
                </div>
                
                <div class="form-group">
                  <label for="email">Your Email</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email" 
                    v-model="email" 
                    required 
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="message">Your Message</label>
                <textarea 
                  id="message"
                  placeholder="Tell us what's on your mind..." 
                  v-model="message" 
                  required
                ></textarea>
              </div>
              
              <button type="submit" :disabled="loading" class="submit-btn">
                <span v-if="loading" class="loading-spinner"></span>
                {{ loading ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
            
            <div v-if="status" class="form-status" :class="{ 'success': status.includes('sent'), 'error': status.includes('Failed') }">
              {{ status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendContactForm } from '@/services/contactService'

const name = ref('')
const email = ref('')
const message = ref('')
const status = ref('')
const loading = ref(false)

async function handleSubmit() {
  status.value = ''
  loading.value = true
  try {
    await sendContactForm({ name: name.value, email: email.value, message: message.value })
    status.value = 'Your message has been sent! We will get back to you soon.'
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (err) {
    status.value = err?.response?.data?.message || 'Failed to send message. Please try again later.'
  } finally {
    loading.value = false
  }
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
  max-width: 1000px;
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

.contact-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 4rem;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(44, 62, 80, 0.18);
}

.card-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(176, 247, 239, 0.3);
}

.header-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #134e4a;
  margin: 0 0 1rem 0;
}

.header-text p {
  font-size: 1.2rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background: rgba(176, 247, 239, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(176, 247, 239, 0.2);
  transform: translateX(4px);
}

.info-icon {
  font-size: 1.5rem;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5ea6c4 0%, #b2f7ef 100%);
  border-radius: 50%;
  flex-shrink: 0;
}

.info-text h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #134e4a;
  margin: 0 0 0.3rem 0;
}

.info-text p,
.info-text a {
  font-size: 1rem;
  color: #468d8c;
  margin: 0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.info-text a:hover {
  color: #134e4a;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #134e4a;
  margin: 0 0 1rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 1rem;
  font-weight: 600;
  color: #134e4a;
}

.form-group input,
.form-group textarea {
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  background: #f9f9f9;
  color: #134e4a;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #5ea6c4;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(94, 166, 196, 0.1);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
}

.submit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-status {
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
}

.form-status.success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.form-status.error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
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
  
  .contact-card {
    padding: 2.5rem;
  }
  
  .header-text h2 {
    font-size: 2rem;
  }
  
  .header-text p {
    font-size: 1.1rem;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    padding: 1rem;
  }
  
  .info-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style> 