import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderId: null
  }),
  actions: {
    setOrderId(id) {
      this.orderId = id
    }
  }
})
