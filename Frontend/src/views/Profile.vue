<template>
  <div class="profile-container no-scroll">
    <!-- Success Notification Popup -->
    <div v-if="showSuccessMessage" class="success-notification">
      <div class="success-content">
        <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span class="success-text">Profile Updated Successfully!</span>
      </div>
    </div>

    <!-- Error Notification Popup -->
    <div v-if="showErrorMessage" class="error-notification">
      <div class="error-content">
        <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span class="error-text">{{ errorMessage }}</span>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <div class="back-button" @click="$router.go(-1)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="form-header">
          <div class="header-accent"></div>
          <h2>My Profile</h2>
          <p class="header-subtitle">Manage your account settings and preferences</p>
        </div>

        <div class="profile-picture-section">
          <div class="profile-picture-wrapper">
            <img :src="profilePicturePreview || defaultProfilePicture" class="profile-picture" alt="Profile Picture" />
            <div class="picture-overlay">
              <svg class="camera-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-3l-1-1H8L7 3H4zm6 2a4 4 0 100 8 4 4 0 000-8z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <input type="file" accept="image/*" @change="onProfilePictureChange" ref="fileInput" class="file-input" />
          <button type="button" @click="fileInput.click()" class="upload-btn">
            Edit Photo
          </button>
        </div>

        <form @submit.prevent="handleProfileSave" class="profile-form">
          <!-- <div class="form-grid">
            <div class="form-section">
              <div class="bio-header">
                <label for="bio">Bio</label>
                <button 
                  v-if="!isEditingBio" 
                  type="button" 
                  @click="startEditingBio" 
                  class="edit-bio-btn"
                >
                  <svg class="edit-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                  Edit Bio
                </button>
                <div v-else class="bio-actions">
                  <button type="button" @click="confirmEditBio" class="save-bio-btn">
                    <svg class="save-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Ok
                  </button>
                  <button type="button" @click="cancelEditBio" class="cancel-bio-btn">
                    <svg class="cancel-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
              <div class="input-wrapper">
                <div v-if="!isEditingBio" class="bio-display">
                  <p v-if="bio" class="bio-text">{{ bio }}</p>
                  <p v-else class="bio-placeholder">No bio added yet. Click "Edit Bio" to add one.</p>
                </div>
                <textarea 
                  v-else
                  id="bio" 
                  v-model="bio" 
                  placeholder="Tell us about yourself..." 
                  rows="3"
                  class="modern-textarea"
                ></textarea>
              </div>
            </div>
          </div> -->

          <div class="form-section">
            <label>Account Verification</label>
            <div class="verification-wrapper">
              <TelegramVerification />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-section">
              <label for="currentPassword">Current Password</label>
              <div class="input-wrapper">
                <input 
                  id="currentPassword" 
                  v-model="currentPassword" 
                  type="password" 
                  placeholder="Enter current password"
                  class="modern-input"
                />
              </div>
            </div>

            <div class="form-section">
              <label for="newPassword">New Password</label>
              <div class="input-wrapper">
                <input 
                  id="newPassword" 
                  v-model="newPassword" 
                  type="password" 
                  placeholder="Enter new password"
                  class="modern-input"
                />
              </div>
            </div>

            <div class="form-section">
              <label for="confirmPassword">Confirm New Password</label>
              <div class="input-wrapper">
                <input 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  type="password" 
                  placeholder="Confirm new password"
                  class="modern-input"
                />
              </div>
            </div>
          </div>

          <div class="wrapper">
            <button type="submit" class="save-btn">
              <svg class="save-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/utility/axiosInstance'
import { useAuthStore } from '@/stores/auth'
import TelegramVerification from '@/components/TelegramVerification.vue'

const authStore = useAuthStore()

const bio = ref('')
const isEditingBio = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const errorMessage = ref('')

const profilePicturePreview = ref('')
const selectedProfilePictureFile = ref(null)
const defaultProfilePicture = 'https://ui-avatars.com/api/?name=User&background=0d3d31&color=fff&size=128'

onMounted(() => {
  console.log('🔍 onMounted - authStore:', authStore)
  console.log('🔍 onMounted - authStore.setBio:', authStore.setBio)
  console.log('🔍 onMounted - authStore.bio:', authStore.bio)
  
  if (authStore.profilePicture) {
    profilePicturePreview.value = authStore.profilePicture
  }
  if (authStore.bio) {
    bio.value = authStore.bio
  }
})

const fileInput = ref(null)
const originalBio = ref('')

function onProfilePictureChange(e) {
  const file = e.target.files[0]
  if (file) {
    selectedProfilePictureFile.value = file
    const reader = new FileReader()
    reader.onload = (event) => {
      profilePicturePreview.value = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

function startEditingBio() {
  originalBio.value = bio.value
  isEditingBio.value = true
}

function cancelEditBio() {
  bio.value = originalBio.value
  isEditingBio.value = false
}

function confirmEditBio() {
  // Just exit edit mode, don't save yet
  isEditingBio.value = false
}

async function getImageKitAuthParams() {
  const response = await axiosInstance.get('/api/users/imagekit-auth')
  return response.data
}

async function uploadToImageKit(file) {
  const authParams = await getImageKitAuthParams()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', `profile_${Date.now()}_${file.name}`)
  formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY)
  formData.append('signature', authParams.signature)
  formData.append('expire', authParams.expire.toString())
  formData.append('token', authParams.token)
  formData.append('folder', '/profile_pictures')

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`ImageKit upload failed: ${errorData.message || response.statusText}`)
  }

  const data = await response.json()
  return data.url
}

async function handleProfileSave() {
  try {
    let profilePictureUrl = profilePicturePreview.value

    if (selectedProfilePictureFile.value) {
      profilePictureUrl = await uploadToImageKit(selectedProfilePictureFile.value)
    }

    if (newPassword.value && newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'New password and confirmation do not match.'
      showErrorMessage.value = true
      setTimeout(() => {
        showErrorMessage.value = false
      }, 3000)
      return
    }

    const payload = {}
    let hasChanges = false
    
    // Check if bio has changed (compare with stored bio)
    const currentStoredBio = authStore.bio || ''
    const bioText = bio.value?.trim() || ''
    if (bioText !== currentStoredBio) {
      payload.bio = bioText
      hasChanges = true
    }
    
    // Check if profile picture has changed
    // Only consider it changed if:
    // 1. User selected a new file, OR
    // 2. Current URL is different from what's stored in auth store
    const currentStoredPicture = authStore.profilePicture || defaultProfilePicture
    const profilePictureChanged = selectedProfilePictureFile.value || 
                                 (profilePictureUrl && profilePictureUrl !== currentStoredPicture)
    
    if (profilePictureChanged) {
      payload.profile_picture = profilePictureUrl
      hasChanges = true
    }
    
    // Check if password has changed
    if (newPassword.value?.trim()) {
      payload.password = newPassword.value
      hasChanges = true
    }

    if (!hasChanges) {
      errorMessage.value = 'No changes to save.'
      showErrorMessage.value = true
      setTimeout(() => {
        showErrorMessage.value = false
      }, 3000)
      return
    }

    const response = await axiosInstance.put('/api/users/profile', payload)

    // Only show success if we actually sent changes and got a successful response
    if (response.data && response.data.user) {
      // Update profile picture if changed
      if (response.data.user.profile_picture) {
        const newUrl = response.data.user.profile_picture
        profilePicturePreview.value = newUrl

        // Preload image before updating store
        await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = resolve
          img.onerror = reject
          img.src = newUrl
        })

        // Update the auth store with the new profile picture
        authStore.setProfilePicture(newUrl)
        
      // Update bio if changed
      if (response.data.user.bio !== undefined) {
        if (typeof authStore.setBio === 'function') {
          authStore.setBio(response.data.user.bio)
          console.log('Bio updated in store:', response.data.user.bio)
        } else {
          console.warn('⚠️ authStore.setBio is not a function, updating manually')
          authStore.bio = response.data.user.bio
          if (response.data.user.bio) {
            sessionStorage.setItem('bio', response.data.user.bio)
          } else {
            sessionStorage.removeItem('bio')
          }
        }
      }

      selectedProfilePictureFile.value = null
      newPassword.value = ''
      confirmPassword.value = ''
      currentPassword.value = ''

      // Show success notification only when we actually made changes
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    } else {
      // If backend didn't return expected data, show error
      errorMessage.value = 'Failed to update profile. Please try again.'
      showErrorMessage.value = true
      setTimeout(() => {
        showErrorMessage.value = false
      }, 3000)
    }
  } catch (err) {
    console.error('Profile update error:', err)
    if (err.message.includes('ImageKit')) {
      errorMessage.value = 'Failed to upload profile picture. Check your internet connection.'
    } else {
      errorMessage.value = 'Failed to update profile. Please try again.'
    }
    showErrorMessage.value = true
    setTimeout(() => {
      showErrorMessage.value = false
    }, 3000)
  }
}
</script>

<style scoped>
* { box-sizing: border-box; }

.profile-container.no-scroll {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  margin: 0;
  padding: 1rem;
}

.profile-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100%;
}

.profile-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 900px;
  width: 100%;
  position: relative;
  animation: fadeInUp 0.6s ease-out;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a5568;
  transition: all 0.2s ease;
  z-index: 10;
}

.back-button:hover {
  background: #f7fafc;
  border-color: #38c172;
  color: #38c172;
  transform: scale(1.05);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.header-accent {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #38c172, #2f855a);
  margin: 0 auto 20px;
  border-radius: 2px;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
  font-weight: 400;
}

.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.profile-picture-wrapper {
  position: relative;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-picture-wrapper:hover {
  transform: scale(1.05);
}

.profile-picture-wrapper:hover .picture-overlay {
  opacity: 1;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #b2f7ef;
  background: #e0f2f1;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.15);
  transition: all 0.3s ease;
}

.picture-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(19, 78, 74, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.camera-icon {
  width: 28px;
  height: 28px;
  color: white;
}

.file-input {
  display: none;
}

.upload-btn {
  background: linear-gradient(135deg, #5ea6c4 0%, #b2f7ef 100%);
  color: #134e4a;
  border: none;
  border-radius: 12px;
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(94, 166, 196, 0.2);
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(94, 166, 196, 0.3);
  background: linear-gradient(135deg, #4a9aba 0%, #a0f0e3 100%);
}

.profile-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-section label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.bio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.edit-bio-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #5ea6c4 0%, #b2f7ef 100%);
  color: #134e4a;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-bio-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(94, 166, 196, 0.3);
}

.edit-icon {
  width: 14px;
  height: 14px;
}

.bio-actions {
  display: flex;
  gap: 8px;
}

.save-bio-btn,
.cancel-bio-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-bio-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.save-bio-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.cancel-bio-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.cancel-bio-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.save-icon,
.cancel-icon {
  width: 12px;
  height: 12px;
}

.bio-display {
  width: 100%;
  min-height: 100px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  display: flex;
  align-items: flex-start;
}

.bio-text {
  margin: 0;
  color: #2d3748;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.bio-placeholder {
  margin: 0;
  color: #a0aec0;
  font-size: 0.95rem;
  font-style: italic;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.modern-input,
.modern-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  color: #2d3748;
  font-weight: 500;
}

.modern-input:focus,
.modern-textarea:focus {
  outline: none;
  border-color: #38c172;
  box-shadow: 0 0 0 3px rgba(56, 193, 114, 0.1);
  background: white;
}

.modern-input:hover,
.modern-textarea:hover {
  border-color: #cbd5e0;
  background: #fafbfc;
}

.modern-input::placeholder,
.modern-textarea::placeholder {
  color: #a0aec0;
  font-weight: 400;
}

.modern-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.verification-wrapper {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
}

.wrapper {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
}

.save-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

.save-btn:active {
  transform: translateY(0);
}

.save-icon {
  width: 18px;
  height: 18px;
}

/* Success Notification */
.success-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
  animation: slideDown 0.5s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.success-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 1rem;
}

.success-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.success-text {
  white-space: nowrap;
}

/* Error Notification */
.error-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(245, 101, 101, 0.3);
  animation: slideDown 0.5s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 1rem;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.error-text {
  white-space: nowrap;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .profile-container.no-scroll {
    padding: 1rem 0.5rem;
  }
  
  .profile-card {
    padding: 24px;
    margin: 0;
  }
  
  .form-header h2 {
    font-size: 1.6rem;
  }
  
  .header-subtitle {
    font-size: 0.9rem;
  }
  
  .profile-picture {
    width: 100px;
    height: 100px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .modern-input,
  .modern-textarea {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .form-header h2 {
    font-size: 1.4rem;
  }
  
  .header-subtitle {
    font-size: 0.8rem;
  }
  
  .profile-card {
    padding: 20px;
  }
  
  .form-section {
    gap: 4px;
  }
  
  .save-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style> 