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
    coins: Number(sessionStorage.getItem('coins')) || 0,
    profilePicture: sessionStorage.getItem('profilePicture') || null,
  }),
  actions: {
    login(token, userInfo) {
      this.token = token
      this.userId = userInfo?.user_id || null
      this.userName = userInfo?.name || null
      this.coins = userInfo?.coins || 0

      sessionStorage.setItem('token', token)
      sessionStorage.setItem('userId', this.userId)
      sessionStorage.setItem('userName', this.userName)
      sessionStorage.setItem('coins', this.coins.toString())

    },
    logout() {
      this.token = null
      this.userId = null
      this.userName = null
      this.coins = 0
      this.profilePicture = null

      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('userName')
      sessionStorage.removeItem('coins')
      sessionStorage.removeItem('profilePicture')

      // for supabase realtime 
      if (window.realtimeOrdersService) {
        window.realtimeOrdersService.unsubscribe()
      }
      
    },
    isAuthenticated() {
      return !!this.token
    },
    updateCoins(newCoins) {
      this.coins = newCoins
      sessionStorage.setItem('coins', newCoins.toString())
    },
    setProfilePicture(profilePictureUrl) {
      this.profilePicture = profilePictureUrl
      sessionStorage.setItem('profilePicture', profilePictureUrl)
    }

  }
})
