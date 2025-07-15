// for realtime order updates using Supabase Realtime

import { realtimeOrdersService } from './realtimeOrdersService'

class GlobalRealtimeManager {
  constructor() {
    this.isSubscribed = false
  }

  // Initialize real-time subscriptions when user logs in
  initializeSubscriptions(authStore) {
    if (authStore.isAuthenticated && !this.isSubscribed) {
      // Set up order subscriptions
      this.setupOrderSubscriptions(authStore)
      this.isSubscribed = true
    }
  }

  // Clean up subscriptions when user logs out
  cleanupSubscriptions() {
    realtimeOrdersService.unsubscribe()
    this.isSubscribed = false
  }

  setupOrderSubscriptions(authStore) {
    // This will be called by components that need real-time updates
    // Components can register their callback functions here
    const userId = authStore.userId
    // You can set up subscriptions here if needed
  }
}

export const globalRealtimeManager = new GlobalRealtimeManager()