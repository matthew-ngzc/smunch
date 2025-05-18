/**
 * Purpose of vue store: 
 *      - shared global state (eg. isLoggedIn, username, etc.)
 *      - contains mutations and actions that modify the state
 *      - exposes getters to access the state from components
 *      - meant to be imported and used across multiple views/components
 */


import { createStore } from 'vuex'
import auth from './auth'

export default createStore({
  modules: {
    auth
    // more to be added 
  }
})
