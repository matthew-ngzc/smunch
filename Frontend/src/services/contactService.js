import axiosInstance from '@/utility/axiosInstance'

/**
 * Send contact form (POST)
 */
export async function sendContactForm({ name, email, message }) {
  return axiosInstance.post('/api/contact', { name, email, message })
} 