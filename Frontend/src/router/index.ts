/**
 * REIWEN :
 * This router folder has index.ts 
 * Everytime you want to route, you must create all your different routes here. (only create but haven't done the actual routing) 
 */
import { createRouter, createWebHistory } from 'vue-router'

// REIWEN : remember to import the components used for each router object in routes[]
import Home from '../views/Home.vue'
import About from '../views/About.vue'


// REIWEN : this is a routes array and each route object has 3 properties
const routes = [
  {
    path: '/',
    // REIWEN : name is just the name/identifier for the path
    name: 'homeView',
    // REIWEN : we also have the vue component that we want to use when user goes to '/' path
    // go to your views directory to see what you have named your component
    component: Home
  },
  {
    path: '/about',
    name: 'aboutView',
    component: About
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
