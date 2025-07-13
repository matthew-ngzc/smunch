<template>
  <div class="home no-scroll">
    <div class="home-content">
      <h1 class="greeting">Contact Us</h1>
      <div class="contact-section">
        <p>If you have any questions, feedback, or need support, feel free to reach out to us!</p>
        <ul class="contact-info">
          <li>Email: <a href="mailto:smunch.dev@gmail.com">smunch.dev@gmail.com</a></li>
          <li>Location: SMU Campus</li>
        </ul>
        <form class="contact-form" @submit.prevent>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
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
.contact-section {
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
.contact-info {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}
.contact-info li {
  margin-bottom: 0.5rem;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.contact-form input,
.contact-form textarea {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1.5px solid #e0e0e0;
  font-size: 1rem;
  background: #f9f9f9;
  color: #134e4a;
}
.contact-form textarea {
  min-height: 100px;
  resize: vertical;
}
.contact-form button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.contact-form button:hover {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}
</style> 