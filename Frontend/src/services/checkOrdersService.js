import axiosInstance from '@/utility/axiosInstance'

// get user's active orders
export async function getActiveOrders(userId) {
  return axiosInstance.get(`/api/orders/user/${userId}?type=active`)
}

// get user's past orders
export async function getPastOrders(userId) {
  return axiosInstance.get(`/api/orders/user/${userId}?type=history`)
}
