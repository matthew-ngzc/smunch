/**
 * REIWEN :
 * This router folder has index.ts 
 * Everytime you want to route, you must create all your different routes here. (only create but haven't done the actual routing) 
 */
import { createRouter, createWebHistory } from 'vue-router'

// REIWEN : remember to import the components used for each router object in routes[]
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
import Help from '../views/Help.vue'
import PastOrders from '../views/PastOrders.vue'
import ActiveOrders from '../views/ActiveOrders.vue'
import Profile from '../views/Profile.vue'
import FAQ from '../views/FAQ.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Game from '../views/Game.vue'

// REIWEN : this is a routes array and each route object has 3 properties
  const routes = [
  { path: '/', name: 'landingPage', component: LandingPage },     
  { path: '/order', name: 'Order', component: OrderPage },
  { path: '/run', name: 'Run', component: RunnerPage },        
  { path: '/home', name: 'Home', component: Home },
  { path: '/signup', name: 'signup', component: signup },
  { path: '/login', name: 'login', component: login },
  { path: '/order/:id', name: 'orderMerchant', component: OrderMerchant },
  { path: '/summary', name: 'orderSummary', component: OrderSummary },
  { path: '/payment', name: 'payment', component: Payment },
  { path: '/cart', name: 'cartPage', component: CartPage },
  { path: '/location', name: 'selectLocation', component: SelectLocation },
  { path: '/:catchAll(.*)', name: "pageNotFound", component: PageNotFound}, // redirect user to this page if path is not a valid one 
  { path: '/activeorders', name: 'activeorders', component: ActiveOrders },
  { path: '/pastorders', name: 'pastorders', component: PastOrders },
  { path: '/help', name: 'help', component: Help },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/faq', name: 'faq', component: FAQ },
  { path: '/about', name: 'about', component: About },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/game', name: 'game', component: Game }
]


// REIWEN: Here is actually where we set up the router instance 
// aka the thing that actually creates a router for the app 
const router = createRouter({
  // this just helps you to click "<-" and "->" in your browser 
  history: createWebHistory(import.meta.env.BASE_URL),
  // you also pass in your `routes` array so that the router instance knows what it needs to do
  routes


})

export default router
