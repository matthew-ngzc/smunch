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
import axiosInstance from '../utility/axiosInstance.js'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
    userId: sessionStorage.getItem('userId') || null,
    userName: sessionStorage.getItem('userName') || null,
    coins: Number(sessionStorage.getItem('coins')) || 0,
    profilePicture: sessionStorage.getItem('profilePicture') || null,
    dinoUnlocked: (() => {
      const stored = sessionStorage.getItem('dinoUnlocked')
      return (stored && stored !== 'null') ? stored : null
    })(),
  }),
  actions: {
    login(token, userInfo) {
      console.log('🔐 Auth store login called with:', {
        token: token ? 'present' : 'missing',
        userInfo: userInfo
      })
      
      this.token = token
      this.userId = userInfo?.user_id || null
      this.userName = userInfo?.name || null
      this.coins = userInfo?.coins || 0
      this.profilePicture = userInfo?.profile_picture || null
      this.dinoUnlocked = userInfo?.dinoUnlocked || null

      console.log('💾 Storing dino_unlocked:', this.dinoUnlocked)

      sessionStorage.setItem('token', token)
      sessionStorage.setItem('userId', this.userId)
      sessionStorage.setItem('userName', this.userName)
      sessionStorage.setItem('coins', this.coins.toString())
      
      if (this.profilePicture) {
        sessionStorage.setItem('profilePicture', this.profilePicture)
      }
      
      // Handle dinoUnlocked properly in sessionStorage
      if (this.dinoUnlocked === null) {
        sessionStorage.removeItem('dinoUnlocked')
      } else {
        sessionStorage.setItem('dinoUnlocked', this.dinoUnlocked)
      }
    },
    logout() {
      this.token = null
      this.userId = null
      this.userName = null
      this.coins = 0
      this.profilePicture = null
      this.dinoUnlocked = null

      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('userName')
      sessionStorage.removeItem('coins')
      sessionStorage.removeItem('profilePicture')
      sessionStorage.removeItem('dinoUnlocked')

      // for supabase realtime 
      if (window.realtimeOrdersService) {
        window.realtimeOrdersService.unsubscribe()
      }
    },
    isAuthenticated() {
      return !!this.token
    },
    updateCoins(newCoins) {
      console.log('🪙 Auth Store: updateCoins called', {
        oldCoins: this.coins,
        newCoins: newCoins,
        difference: newCoins - this.coins
      })
      
      this.coins = newCoins
      sessionStorage.setItem('coins', newCoins.toString())
      
      console.log('🪙 Auth Store: Coins updated successfully, calling backend save...')
      
      // Save to backend
      this.saveCollectionsToBackend()
    },
    setProfilePicture(profilePictureUrl) {
      console.log('🖼️ Auth Store: setProfilePicture called with:', profilePictureUrl)
      this.profilePicture = profilePictureUrl
      sessionStorage.setItem('profilePicture', profilePictureUrl)
      console.log('🖼️ Auth Store: profilePicture state updated to:', this.profilePicture)
      console.log('🖼️ Auth Store: sessionStorage updated to:', sessionStorage.getItem('profilePicture'))
    },
    updateDinoUnlocked(newDinoUnlocked) {
      console.log('🦕 Auth Store: updateDinoUnlocked called', {
        oldDinoUnlocked: this.dinoUnlocked,
        newDinoUnlocked: newDinoUnlocked
      })
      
      this.dinoUnlocked = newDinoUnlocked
      
      // Handle null values properly in sessionStorage
      if (newDinoUnlocked === null) {
        sessionStorage.removeItem('dinoUnlocked')
      } else {
        sessionStorage.setItem('dinoUnlocked', newDinoUnlocked)
      }
      
      console.log('🦕 Auth Store: DinoUnlocked updated successfully to:', this.dinoUnlocked)
      console.log('🦕 Auth Store: Calling backend save...')
      
      // Save to backend
      this.saveCollectionsToBackend()
    },
    async saveCollectionsToBackend() {
      if (!this.token) {
        console.log('⚠️ Auth Store: No token, skipping backend save')
        return // Don't save if not logged in
      }
      
      console.log('📡 Auth Store: Saving to backend...', {
        coins: this.coins,
        dinoUnlocked: this.dinoUnlocked
      })
      
      try {
        const response = await axiosInstance.put('/api/users/collections', {
          coins: this.coins,
          dinoUnlocked: this.dinoUnlocked
        })
        console.log('✅ Auth Store: Backend save successful!', response.data)
      } catch (error) {
        console.warn('❌ Auth Store: Failed to save collections data to backend:', error)
        // Don't throw error - allow local state to remain updated
      }
    },
    getDinoUnlocked() {
      return this.dinoUnlocked
    },
  }
})
