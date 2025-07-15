import axiosInstance from '@/utility/axiosInstance'

/**
 * Get all merchants 
 */
// calling backend endpoint
export async function fetchAllMerchants() {
  return axiosInstance.get('/api/merchants')
}

// get only merchants with parent id = null
export async function fetchParentMerchants() {
  return axiosInstance.get('/api/merchants?parent_merchant_id=null')
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
export async function getActiveOrders(userId, limit = 5, offset = 0) {
  return axiosInstance.get(`/api/orders/user/${userId}?type=active&limit=${limit}&offset=${offset}`)
}

// get user's past orders
export async function getPastOrders(userId, limit = 5, offset = 0) {
  return axiosInstance.get(`/api/orders/user/${userId}?type=history&limit=${limit}&offset=${offset}`)
}
/**
 * Create an order (POST)
 */
export async function createOrder(payload) {
  return axiosInstance.post('/api/orders', payload)
}

/**
 * GET the payment QR Code
 */
export async function getPaymentQRCode(id) { 
  return axiosInstance.get(`/api/orders/${id}/payment `)
}

/**
 * (PUT) Update payment status
 */
export async function updatePaymentStatus(orderId) {
  return axiosInstance.put(`/api/orders/${orderId}/payment-status`, { 
    status: 'awaiting_verification'
  })
}

/**
 * Send contact form (POST)
 */
export async function sendContactForm({ name, email, message }) {
  return axiosInstance.post('/api/health/contact', { name, email, message })
}


// refresh and get user's order status 
export async function getRefreshedOrders(orderId) {
  return axiosInstance.get(`/api/orders/${orderId}/refresh-status`)
}


