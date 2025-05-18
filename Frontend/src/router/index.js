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


// REIWEN : this is a routes array and each route object has 3 properties
const routes = [
  {
    path: '/',
    // REIWEN : name is just the name/identifier for the path
    name: 'landingPage',
    // REIWEN : we also have the vue component that we want to use when user goes to '/' path
    // go to your views directory to see what you have named your component
    component: LandingPage
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },


  {
    path: '/orders',
    name: "orderPage",
    component: OrderPage
  },
  {
    path: '/orders/:id',
    name: "orderMerchant",
    component: OrderMerchant
  },
  {
    path: '/runners',
    name: "runnerPage",
    component: RunnerPage
  },


  // redirect user to this page if path is not a valid one 
  {
    path: '/:catchAll(.*)',
    name: "pageNotFound",
    component: PageNotFound
  }
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
