/**
 * REIWEN: Purpose of this file
 * This is to create a reusable, pre-configured Axios instance for making HTTP requests to your backend API
 *   - environment-specific base URLs (dev vs. deployed)
 *   - JSON headers
 *   - token-based authorization (via session storage)
 *   - error handling via interceptors
 */


import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

function determineBaseURL(environment) {
  if (environment === 'deployed') {
    return 'https://backend-production-cbdf.up.railway.app'
  } else {
    return 'http://124.243.149.250:3000' // adjust port to your backend dev server
  }
}

// Automatically pick based on Vite environment variable
const baseURL = determineBaseURL(import.meta.env.VITE_ENVIRONMENT)

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Attach token from sessionStorage (if exists)
axiosInstance.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    const token = authStore.token
    console.log('Axios interceptor - token from store:', token)
    console.log('Axios interceptor - auth store:', authStore)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Axios interceptor - Authorization header set:', config.headers.Authorization)
    } else {
      console.log('Axios interceptor - No token found in auth store')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosInstance
