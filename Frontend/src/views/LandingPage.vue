<template>
  <div>
    <section class="hero-image-row">
      <div class="hero-image-left">
        <img class="full-img" :src="dinoSmunchIcon" alt="dinoSmunch" />
      </div>
      <div class="hero-text-right">
        <h1 class="hero-title">smunch</h1>
        <p class="hero-subtitle">By students, for students.</p>
        <router-link to="/signup">
          <button class="hero-button">Get Started</button>
        </router-link>
      </div>
    </section>

      <!-- Why Use SMUNCH Section -->
       <div>
      <section class="section benefits-section">
        <div class="text-center benefits-header">
          <h2 class="section-title">Why Use SMUNCH?</h2>
          <p class="section-subtitle">
            Our platform offers unique advantages for the campus community
          </p>
        </div>
        <div class="row text-center justify-content-center">
          <div class="col-md-4 benefit">
            <img src="/dinoTime.png" alt="Save Time" class="benefit-icon" />
            <h5 class="benefit-title">Save Time</h5>
            <p class="benefit-text">
              No need to leave class or study spots. Get food delivered during short breaks.
            </p>
          </div>
          <div class="col-md-4 benefit">
            <img src="/richDino.png" alt="Earn Money" class="benefit-icon" />
            <h5 class="benefit-title">Earn Money</h5>
            <p class="benefit-text">
              Turn free time between classes into an earning opportunity by delivering food.
            </p>
          </div>
          <div class="col-md-4 benefit">
            <img src="/dinoandfriends.png" alt="Connect with Peers" class="benefit-icon" />
            <h5 class="benefit-title">Connect with Peers</h5>
            <p class="benefit-text">
              Build community by helping fellow students and making new connections.
            </p>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="section">
        <h4 class="testimonial-header">Hear what our customers say about us!</h4>
        <Testimonials />
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
              <p>
                Connecting hungry students with fellow students willing to deliver food on campus.
              </p>
            </div>
            <div class="col-md-4 mb-3">
              <h5>Quick Links</h5>
              <ul class="list-unstyled footer-links">
                <li><a href="#" @click.prevent="handleHomeClick">Home</a></li>
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
    </div>
  <!-- </div> -->
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import Testimonials from '@/components/Testimonials.vue'
import dinoSmunchIcon from '/dinoSMUNCHING.png'

export default defineComponent({
  name: 'LandingPage',
  components: { Testimonials },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const handleHomeClick = () => {
      if (authStore.isAuthenticated()) {
        router.push('/home')
      } else {
        router.push('/signup')
      }
    }

    return { 
      dinoSmunchIcon,
      handleHomeClick
    }
  },
})
</script>

<style scoped>
/* Full-width hero */
.hero-image-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
  background-color: #e8f6ef;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

/* Centered wrapper for everything else */
/* .page-wrapper { */
  /* max-width:max-content; */
  /* margin: 0 auto; */
  /* padding: 2rem 0 0; */
/* } */

/* Hero section styles */
.hero-image-left,
.hero-text-right {
  flex: 1;
  padding-left: 10rem;
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.hero-title {
  font-size: 7rem;
  font-weight: 700;
  color: #0d3d31;
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 600;
  color: #0d3d31;
  margin-bottom: 2rem;
}

.hero-button {
  background-color: #0d3d31;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.hero-button:hover {
  background-color: #0b2e26;
}

/* Dino Smunch Image Size*/
.full-img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Section styles */
.section {
  margin: 4rem 0;
  text-align: center;
}

/* Why Use Smunch */
.benefits-section {
  margin: 0;
  padding: 3rem;
  background-color: #f9f9f9;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.section-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: #0d3d31;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #244f36;
}

.benefit-icon {
  width: 200px;
  height: 200px;
  margin-bottom: 1rem;
}

.benefit-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #0d3d31;
}

.benefit-text {
  font-size: 0.95rem;
  color: #555;
}

.cta-section {
  background-color: #0d3d31;
  color: white;
  padding: 2rem;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.cta-title {
  font-size: 2rem;
  font-weight: bold;
}

.cta-subtitle {
  font-size: 1.2rem;
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

/* Footer */
.footer {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background-color: #0d3d31;
  color: white;
  padding: 1rem;
  margin-bottom: -3rem;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-links li {
  margin-bottom: 0.3rem;
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
}

.footer-copy {
  font-size: 0.65rem;
}

</style>
