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