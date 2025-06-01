import axiosInstance from '@/utility/axiosInstance'

/**
 * Get all merchants 
 */
// calling backend endpoint
export async function fetchAllMerchants() {
  return axiosInstance.get('/orders')
}


/* 
 * Fetch one order/merchant by ID 
 */
export async function getOrderById(id) {
  return axiosInstance.get(`/orders/${id}`)
}