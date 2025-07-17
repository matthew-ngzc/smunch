import axiosInstance from '@/utility/axiosInstance'


export async function requestResetLink(email) {
  return axiosInstance.post('/api/auth/forgot-password', {email} )
}

export async function updateProfilePassword(password) {
    return axiosInstance.put('/api/users/profile', {password})
}

export async function resetUserPassword(password) {
    return axiosInstance.put('/api/auth/reset-password', {password})
}
