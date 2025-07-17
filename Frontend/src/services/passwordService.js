import axiosInstance from '@/utility/axiosInstance'


export async function requestResetLink(email) {
  return axiosInstance.post('/api/auth/forgot-password', {email} )
}

export async function updateUserPassword(password) {
    return axiosInstance.put('/api/users/profile', {password})
}