import axiosInstance from '@/utility/axiosInstance'

/**
 * Get all merchants 
 */
// calling backend endpoint
export async function fetchAllMerchants() {
  return axiosInstance.get('/api/merchants')
}


/* 
 * Fetch one menu of merchant by merchant_ID 
 */
export async function getMenuById(id) {
  return axiosInstance.get(`/api/merchants/${id}/menu`)
}


/*
 * Get a merchant by ID 
 *  - merchant name
 *  - location
 *  - contact
 *  - image_url 
 */ 
export async function getMerchantInfoById(id) {
  return axiosInstance.get(`/api/merchants/${id}`)
}


// get user's active orders
export async function getActiveOrders(userId) {
  return axiosInstance.get(`/api/orders/user/${userId}?type=active`)
}

// get user's past orders
export async function getPastOrders(userId) {
  return axiosInstance.get(`/api/orders/user/${userId}?type=history`)
}
