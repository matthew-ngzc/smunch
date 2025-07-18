<template>
  <div class="page-not-found no-scroll">
    <div class="not-found-content">
      <div class="dino-section">
        <img src="/public/PageNotFoundDino.png" alt="Page Not Found Dino" class="dino-image" />
      </div>
      
      <div class="message-section">
        <h1 class="error-code">404</h1>
        <h2 class="error-message">Rawr!! Page Not Found.</h2>
        <p class="error-description">Oops! The page you're looking for seems to have wandered off into the prehistoric wilderness.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }

.page-not-found.no-scroll {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.not-found-content {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  animation: fadeInUp 0.8s ease-out;
  gap: 2rem; 
}

.dino-section {
  margin-bottom: 0;
  animation: bounce 2s ease-in-out infinite;
}

.dino-image {
  width: 280px;
  height: 280px;
  object-fit: contain;
  filter: drop-shadow(0 8px 32px rgba(44, 62, 80, 0.15));
}

.message-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-code {
  font-size: 4rem;
  font-weight: 900;
  color: #134e4a;
  margin: 0;
  text-shadow: 0 4px 16px rgba(44, 62, 80, 0.2);
  line-height: 1;
  text-align: center;
}

.error-message {
  font-size: 2.5rem;
  font-weight: 800;
  color: #134e4a;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.1);
  text-align: center;
}

.error-description {
  font-size: 1.2rem;
  color: #468d8c;
  font-weight: 500;
  margin: 0;
  max-width: 500px;
  line-height: 1.6;
  text-align: center;
}



/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .not-found-content {
    padding: 1rem;
  }
  
  .dino-image {
    width: 200px;
    height: 200px;
  }
  
  .error-code {
    font-size: 3rem;
  }
  
  .error-message {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  

}

@media (max-width: 480px) {
  .error-code {
    font-size: 2.5rem;
  }
  
  .error-message {
    font-size: 1.5rem;
  }
  
  .dino-image {
    width: 160px;
    height: 160px;
  }
}
</style>