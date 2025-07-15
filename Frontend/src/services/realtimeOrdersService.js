// for realtime order updates using Supabase Realtime

/*
This service listens for live changes in orders table in Supabase only for the currently logged-in user
Lets my frontend react immediately (eg.  re-fetching updated orders when an order status changes or a new one is added)
*/ 

import { supabase } from '@/lib/supabaseClient'
import { getActiveOrders } from './orderFoodService'

export class RealtimeOrdersService {
  constructor() {
    this.subscription = null
  }

  // Subscribe to real-time changes for the current user's orders
  subscribeToOrderChanges(userId, callback) {
    this.subscription = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${userId}` // Only listen to changes for this user
        },
        (payload) => {
          console.log('Real-time order change detected:', payload)
          callback(payload) // Trigger callback to refetch orders
        }
      )
      .subscribe()
  }

  // Unsubscribe from real-time updates
  unsubscribe() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription)
      this.subscription = null
    }
  }
}

export const realtimeOrdersService = new RealtimeOrdersService()

