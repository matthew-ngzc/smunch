import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../views/LandingPage.vue'
import Home from '../views/Home.vue'
import OrderPage from '../views/OrderPage.vue'
import OrderMerchant from '../views/OrderMerchant.vue'
import PageNotFound from '../views/PageNotFound.vue'
import RunnerPage from '../views/RunnerPage.vue'
import signup from '../views/signup.vue'
import login from '../views/login.vue'
import CartPage from '../views/CartPage.vue'
import SelectLocation from '../views/SelectLocation.vue'
import OrderSummary from '../views/OrderSummary.vue'
import Payment from '../views/Payment.vue'
import PastOrders from '../views/PastOrders.vue'
import ActiveOrders from '../views/ActiveOrders.vue'
import Profile from '../views/Profile.vue'
import FAQ from '../views/FAQ.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Game from '../views/Game.vue'
import Collections from '../views/Collections.vue'
import ResetPassword from '../views/ResetPassword.vue'
import VerifyAccount from '../views/VerifyAccount.vue'

// REIWEN : this is a routes array and each route object has 3 properties
  const routes = [
  { path: '/', name: 'landingPage', component: LandingPage },     
  { path: '/order', name: 'Order', component: OrderPage, meta: { requiresAuth: true } },
  { path: '/run', name: 'Run', component: RunnerPage, meta: { requiresAuth: true } },        
  { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/signup', name: 'signup', component: signup },
  { path: '/login', name: 'login', component: login },
  { path: '/order/:id', name: 'orderMerchant', component: OrderMerchant, meta: { requiresAuth: true } },
  { path: '/summary', name: 'orderSummary', component: OrderSummary, meta: { requiresAuth: true } },
  { path: '/payment', name: 'payment', component: Payment, meta: { requiresAuth: true } },
  { path: '/cart', name: 'cartPage', component: CartPage, meta: { requiresAuth: true } },
  { path: '/location', name: 'selectLocation', component: SelectLocation, meta: { requiresAuth: true } },
  { path: '/:catchAll(.*)', name: "pageNotFound", component: PageNotFound}, // redirect user to this page if path is not a valid one 
  { path: '/activeorders', name: 'activeorders', component: ActiveOrders, meta: { requiresAuth: true } },
  { path: '/pastorders', name: 'pastorders', component: PastOrders, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/faq', name: 'faq', component: FAQ },
  { path: '/about', name: 'about', component: About },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/game', name: 'game', component: Game, meta: { requiresAuth: true } },
  { path: '/collections', name: 'collections', component: Collections, meta: { requiresAuth: true } },
  { path: '/reset-password', name: 'resetpassword', component: ResetPassword, meta: {hideNavbar: true} },
  { path: '/verify-account', name: 'verifyaccount', component: VerifyAccount, meta: {hideNavbar: true} },
]

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),

  routes
})


router.beforeEach((to, from, next) => {

  if (to.meta.requiresAuth) {
  
    const token = sessionStorage.getItem('token')
    
    if (!token) {
      console.log('Route protection: No token found, redirecting to login')
      next('/login')
      return
    }
  
    console.log('Route protection: Token found, allowing access to', to.path)
    next()
  } else {
    next()
  }
})

export default router
