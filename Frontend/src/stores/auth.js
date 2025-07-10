/**
 * Handles : 
 *  - login state
 *  - user identity
 *  - token handling 
 *  - login and logout logic
 */

/**
 * Why do we do this?
 * 
 * Because multiple components might need to: 
 *  - Check if a user is logged in
 *  - Display the username etc 
 * 
 * so stores/auth.ts acts as the single source of truth for the user's session
 */


// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
    user: null, // Optional: store user info like id/email
  }),
  actions: {
    login(token, user = null) {
      this.token = token
    //   this.user = user
      sessionStorage.setItem('token', token)
    },
    logout() {
      this.token = null
      this.user = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    },
    isAuthenticated() {
      return !!this.token
    }
  }
})
