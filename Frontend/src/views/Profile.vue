<template>
  <div class="profile-container no-scroll">
    <div class="profile-content">
      <div class="header-section">
        <h1 class="greeting">My Profile</h1>
        <p class="subtitle">Manage your account settings and preferences</p>
      </div>

      <div class="profile-card">
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
            Change Photo
          </button>
        </div>

        <form @submit.prevent="handleProfileSave" class="profile-form">
          <div class="form-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="input-group">
              <label for="bio">Bio</label>
              <textarea id="bio" v-model="bio" placeholder="Tell us about yourself..." rows="3"></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Account Verification</h3>
            <TelegramVerification />
          </div>

          <div class="form-section">
            <h3 class="section-title">Security Settings</h3>
            <div class="input-group">
              <label for="currentPassword">Current Password</label>
              <input id="currentPassword" v-model="currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div class="input-group">
              <label for="newPassword">New Password</label>
              <input id="newPassword" v-model="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div class="input-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
          </div>

          <button type="submit" class="save-btn">
            <svg class="save-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<!-- <template>
  <div class="profile-container no-scroll">
    <div class="profile-content">
      <div class="header-section">
        <h1 class="greeting">My Profile</h1>
        <p class="subtitle">Manage your account settings and preferences</p>
      </div>
      
      <div class="profile-card">
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
          <button type="button" @click="$refs.fileInput.click()" class="upload-btn">
            Change Photo
          </button>
        </div>

        <div>
           <TelegramVerification />
        </div>
        <form @submit.prevent="handleProfileSave" class="profile-form">
          <div class="form-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="input-group">
              <label for="bio">Bio</label>
              <textarea id="bio" v-model="bio" placeholder="Tell us about yourself..." rows="3"></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">Account Verification</h3>
            <TelegramVerification />
          </div>

          <div class="form-section">
            <h3 class="section-title">Security Settings</h3>
            <div class="input-group">
              <label for="currentPassword">Current Password</label>
              <input id="currentPassword" v-model="currentPassword" type="password" placeholder="Enter current password" />
            </div>
            <div class="input-group">
              <label for="newPassword">New Password</label>
              <input id="newPassword" v-model="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div class="input-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
          </div>

          <button type="submit" class="save-btn">
            <svg class="save-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  </div>
</template> -->

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

.header-section {
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease-out;
}

.greeting {
  font-size: 2.6rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}

.subtitle {
  font-size: 1.2rem;
  color: #468d8c;
  font-weight: 500;
  margin: 0;
}

.profile-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  padding: 3rem 2.5rem;
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(44, 62, 80, 0.18);
}

.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-picture-wrapper {
  position: relative;
  margin-bottom: 1rem;
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
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #134e4a;
  margin: 0 0 0.5rem 0;
  border-bottom: 2px solid rgba(176, 247, 239, 0.3);
  padding-bottom: 0.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #134e4a;
  margin-left: 0.5rem;
}

.input-group input,
.input-group textarea {
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  background: #f8fafc;
  color: #134e4a;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #5ea6c4;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(94, 166, 196, 0.1);
  transform: translateY(-1px);
}

.input-group textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.save-btn {
  margin-top: 1rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  width: 20px;
  height: 20px;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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
    padding: 2rem 1.5rem;
    margin: 0;
  }
  
  .greeting {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .profile-picture {
    width: 100px;
    height: 100px;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .greeting {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .profile-card {
    padding: 1.5rem 1rem;
  }
  
  .form-section {
    gap: 0.8rem;
  }
  
  .input-group input,
  .input-group textarea {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
  
  .save-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style> 