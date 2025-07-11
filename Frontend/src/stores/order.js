import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderId: null,
    selectedMerchantId: null
  }),
  actions: {
    setOrderId(id) {
      this.orderId = id // for payment, to remember the order id
    },
    setMerchantId(id) {
      this.selectedMerchantId = id // remember which merchant user selected
    }
  }
})
