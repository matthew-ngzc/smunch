import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // component is just the name/identifier for the path
      name: 'homeView',
      
      component: Home
    },
    {
      path: '/about',
      name: 'aboutView',
      component: About
    },
  ],
})

export default router
