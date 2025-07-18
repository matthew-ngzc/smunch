<template>
  <div class="profile-container no-scroll">
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
          <div class="form-grid">
            <div class="form-section">
              <label for="bio">Bio</label>
              <div class="input-wrapper">
                <textarea 
                  id="bio" 
                  v-model="bio" 
                  placeholder="Tell us about yourself..." 
                  rows="3"
                  class="modern-textarea"
                ></textarea>
              </div>
            </div>
          </div>

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
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const profilePicturePreview = ref('')
const selectedProfilePictureFile = ref(null)
const defaultProfilePicture = 'https://ui-avatars.com/api/?name=User&background=0d3d31&color=fff&size=128'

onMounted(() => {
  if (authStore.profilePicture) {
    profilePicturePreview.value = authStore.profilePicture
  }
})

const fileInput = ref(null)

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
      alert('New password and confirmation do not match.')
      return
    }

    const payload = {}
    if (bio.value?.trim()) payload.bio = bio.value.trim()
    if (profilePictureUrl && profilePictureUrl !== defaultProfilePicture) {
      payload.profile_picture = profilePictureUrl
    }
    if (newPassword.value?.trim()) payload.password = newPassword.value

    if (Object.keys(payload).length === 0) {
      alert('No changes to save.')
      return
    }

         const response = await axiosInstance.put('/api/users/profile', payload)
     
     console.log('🔍 Backend response:', response.data)

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
       
       console.log('✅ Profile picture updated in store:', newUrl)
       console.log('💾 SessionStorage after update:', sessionStorage.getItem('profilePicture'))
     } else {
       console.warn('⚠️ No profile_picture in response')
     }

    selectedProfilePictureFile.value = null
    newPassword.value = ''
    confirmPassword.value = ''
    currentPassword.value = ''

    alert('Profile updated successfully!')
  } catch (err) {
    console.error('Profile update error:', err)
    if (err.message.includes('ImageKit')) {
      alert('Failed to upload profile picture. Check your internet connection.')
    } else {
      alert('Failed to update profile. Please try again.')
    }
  }
}
</script>

<!-- <script>
import axiosInstance from '@/utility/axiosInstance';
import { useAuthStore } from '@/stores/auth';
import TelegramVerification from '@/components/TelegramVerification.vue';

export default {
  components: { TelegramVerification },
  data() {
    return {
      bio: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      profilePicturePreview: '',
      selectedProfilePictureFile: null,
      defaultProfilePicture: 'https://ui-avatars.com/api/?name=User&background=0d3d31&color=fff&size=128',
    };
  },
  mounted() {
    const authStore = useAuthStore();
    if (authStore.profilePicture) {
      this.profilePicturePreview = authStore.profilePicture;
    }
  },

  methods: {
    onProfilePictureChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.selectedProfilePictureFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          this.profilePicturePreview = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async uploadToImageKit(file) {
      const authParams = await this.getImageKitAuthParams();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `profile_${Date.now()}_${file.name}`);
      formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      formData.append('signature', authParams.signature);
      formData.append('expire', authParams.expire.toString());
      formData.append('token', authParams.token);
      formData.append('folder', '/profile_pictures');

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ImageKit upload failed: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.url;
    },

    async getImageKitAuthParams() {
      const response = await axiosInstance.get('/api/users/imagekit-auth');
      return response.data;
    },

    async handleProfileSave() {
      try {
        let profilePictureUrl = this.profilePicturePreview;

        if (this.selectedProfilePictureFile) {
          profilePictureUrl = await this.uploadToImageKit(this.selectedProfilePictureFile);
        }

        if (this.newPassword && this.newPassword !== this.confirmPassword) {
          alert('New password and confirmation do not match.');
          return;
        }

        const payload = {};
        if (this.bio?.trim()) payload.bio = this.bio.trim();
        if (profilePictureUrl && profilePictureUrl !== this.defaultProfilePicture) {
          payload.profile_picture = profilePictureUrl;
        }
        if (this.newPassword?.trim()) payload.password = this.newPassword;

        if (Object.keys(payload).length === 0) {
          alert('No changes to save.');
          return;
        }

        const authStore = useAuthStore();
        const response = await axiosInstance.put('/api/users/profile', payload);

        if (response.data.user.profile_picture_url) {
          const newUrl = response.data.user.profile_picture_url;
          this.profilePicturePreview = newUrl;

          // ✅ Preload image before updating
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = newUrl;
          });

          // ✅ Update both store and sessionStorage
          authStore.setProfilePicture(newUrl)
        }

        this.selectedProfilePictureFile = null;
        this.newPassword = '';
        this.confirmPassword = '';
        this.currentPassword = '';

        alert('Profile updated successfully!');
      } catch (err) {
        console.error('Profile update error:', err);
        if (err.message.includes('ImageKit')) {
          alert('Failed to upload profile picture. Check your internet connection.');
        } else {
          alert('Failed to update profile. Please try again.');
        }
      }
    }
  }
};
</script> -->

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