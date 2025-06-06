import { defineStore } from 'pinia'

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    building: '',
    floor: '',
    facilityType: '',
    date: '',
    time: ''
  }),
  actions: {
    setDeliveryInfo({ building, floor, facilityType, date, time }) {
      this.building = building
      this.floor = floor
      this.facilityType = facilityType
      this.date = date
      this.time = time
    }
  }
})
