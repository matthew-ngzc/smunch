<template>
  <div class="page-wrapper">
    <!-- Hero + Image Row -->
    <section class="hero-image-row">
      <div class="hero-image-left">
        <img class="full-img" :src="deliveryManIcon" alt="deliveryMan" />
      </div>
      <div class="hero-text-right">
        <h1 class="hero-title">smunch</h1>
        <p class="hero-subtitle">By students, for students.</p>
        <router-link to="/signup">
          <button class="hero-button">Sign Up</button>
        </router-link>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="section text-center">
      <h4 class="testimonial-header">Hear what our customers say about us!</h4>
      <Testimonials />
    </section>

    <!-- Why Use SMUNCH Section -->
    <section class="section benefits-section">
      <div class="text-center benefits-header">
        <h2 class="section-title">Why Use SMUNCH?</h2>
        <p class="section-subtitle">Our platform offers unique advantages for the campus community</p>
      </div>
      <div class="row text-center justify-content-center">
        <div class="col-md-4 benefit">
          <img src="/src/assets/deliveryMan.png" alt="Save Time" class="benefit-icon" />
          <h5 class="benefit-title">Save Time</h5>
          <p class="benefit-text">No need to leave class or study spots. Get food delivered during short breaks.</p>
        </div>
        <div class="col-md-4 benefit">
          <img src="/src/assets/deliveryMan.png" alt="Earn Money" class="benefit-icon" />
          <h5 class="benefit-title">Earn Money</h5>
          <p class="benefit-text">Turn free time between classes into an earning opportunity by delivering food.</p>
        </div>
        <div class="col-md-4 benefit">
          <img src="/src/assets/deliveryMan.png" alt="Connect with Peers" class="benefit-icon" />
          <h5 class="benefit-title">Connect with Peers</h5>
          <p class="benefit-text">Build community by helping fellow students and making new connections.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section text-center">
      <h2 class="cta-title">Ready to Get Started?</h2>
      <p class="cta-subtitle">Join SMUNCH today and transform how you get food on campus!</p>
      <router-link to="/signup">
        <button class="cta-button">Sign Up Now</button>
      </router-link>
    </section>

    <!-- Footer Section -->
    <footer class="footer">
      <div class="footer-container">
        <div class="row footer-content">
          <div class="col-md-4 mb-3">
            <h5>SMUNCH</h5>
            <p>Connecting hungry students with fellow students willing to deliver food on campus.</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul class="list-unstyled footer-links">
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/about">About Us</router-link></li>
              <li><router-link to="/faq">FAQs</router-link></li>
              <li><router-link to="/contact">Contact</router-link></li>
            </ul>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Contact</h5>
            <p>SMU Campus</p>
            <p>Email: smunch.dev@gmail.com</p>
          </div>
        </div>
        <hr class="footer-divider" />
        <p class="text-center footer-copy">© 2025 SMUNCH. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Testimonials from '@/components/Testimonials.vue'
import deliveryManIcon from '@/assets/deliveryMan.png'

export default defineComponent({
  name: 'LandingPage',
  components: { Testimonials },
  setup() {
    return { deliveryManIcon }
  }
})
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.hero-image-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  background-color: #e8f6ef;
  width: 100%;
}

.hero-image-left,
.hero-text-right {
  flex: 1;
  padding: 1rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  color: #0d3d31;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0d3d31;
  margin-bottom: 2rem;
}

.hero-button {
  background-color: rgba(153, 203, 227, 0.8);
  color: #0d3d31;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  text-decoration: none;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.hero-button:hover {
  background-color: rgba(153, 203, 227, 1);
}

.full-img {
  max-width: 100%;
  height: auto;
  display: block;
}

.section {
  width: max-content;
  text-align: center;
}

.testimonial-header {
  font-weight: 600;
  color: #0d3d31;
  margin-bottom: 1.5rem;
}

.benefits-section {
  background-color: #f9f9f9;
}

.section-title {
  font-weight: 700;
  font-size: 2.25rem;
  color: #0d3d31;
}

.section-subtitle {
  font-size: 1rem;
  color: #6c757d;
}

.benefit-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
}

.benefit-title {
  font-weight: bold;
  font-size: 1.2rem;
  color: #0d3d31;
}

.benefit-text {
  font-size: 0.95rem;
  color: #555;
}

.cta-section {
  background-color: #071c2c;
  color: white;
  width: 100%;
}

.cta-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1rem;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: #38c172;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 2rem;
  transition: 0.3s ease;
}

.cta-button:hover {
  background-color: #2fa36f;
}

.footer {
  background-color: #0d3d31;
  color: white;
  padding: 3rem 1rem 1rem;
  width: 100vw;
  bottom: 0;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-content h5 {
  font-weight: bold;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.footer-divider {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin: 2rem 0 1rem;
}

.footer-copy {
  margin-bottom: 0;
  font-size: 0.875rem;
}
</style>
