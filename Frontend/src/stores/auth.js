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
    userId: sessionStorage.getItem('userId') || null,
    userName: sessionStorage.getItem('userName') || null,
  }),
  actions: {
    login(token, userInfo) {
      this.token = token
      this.userId = userInfo?.user_id || null
      this.userName = userInfo?.name || null

      sessionStorage.setItem('token', token)
      sessionStorage.setItem('userId', this.userId)
      sessionStorage.setItem('userName', this.userName)

    },
    logout() {
      this.token = null
      this.userId = null
      this.userName = null

      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('userName')

      // for supabase realtime 
      if (window.realtimeOrdersService) {
        window.realtimeOrdersService.unsubscribe()
      }
      
    },
    isAuthenticated() {
      return !!this.token
    }
  }
})
