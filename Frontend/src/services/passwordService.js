import axiosInstance from '@/utility/axiosInstance'


export async function requestResetLink(email) {
  return axiosInstance.post('/api/auth/forgot-password', {email} )
}

export async function updateProfilePassword(password) {
    return axiosInstance.put('/api/users/profile', {password})
}


export function resetUserPassword(password, token) {
  return axiosInstance.post('/api/auth/reset-password', {
    password, token
  })
}
