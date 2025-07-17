<template>
  <div class="profile-container no-scroll">
    <div class="profile-card">
      <h2>My Profile</h2>
      <div class="profile-picture-section">
        <img :src="profilePicturePreview || defaultProfilePicture" class="profile-picture" alt="Profile Picture" />
        <input type="file" accept="image/*" @change="onProfilePictureChange" ref="fileInput" />
      </div>
      <form @submit.prevent="handleProfileSave" class="profile-form">
        <div class="input-group">
          <label for="bio">Bio</label>
          <textarea id="bio" v-model="bio" placeholder="Tell us about yourself..." rows="3"></textarea>
        </div>

        <div>
           <TelegramVerification />
        </div>
       

        <div class="input-group">
          <label for="currentPassword">Current Password</label>
          <input id="currentPassword" v-model="currentPassword" type="password" placeholder="Current password" />
        </div>
        <div class="input-group">
          <label for="newPassword">New Password</label>
          <input id="newPassword" v-model="newPassword" type="password" placeholder="New password" />
        </div>
        <div class="input-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="Confirm new password" />
        </div>
        <button type="submit" class="save-btn">Save Changes</button>
      </form>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/utility/axiosInstance';
import { useAuthStore } from '@/stores/auth';
import TelegramVerification from '@/components/TelegramVerification.vue'

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
    }
  },
  methods: {
    onProfilePictureChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.selectedProfilePictureFile = file
        const reader = new FileReader()
        reader.onload = (event) => {
          this.profilePicturePreview = event.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    async uploadToImageKit(file) {
      try {
        // Generate authentication parameters
        const authParams = await this.getImageKitAuthParams()
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileName', `profile_${Date.now()}_${file.name}`)
        formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY)
        formData.append('signature', authParams.signature)
        formData.append('expire', authParams.expire.toString())
        formData.append('token', authParams.token)
        formData.append('folder', '/profile_pictures')
        
        const response = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
     
          throw new Error(`ImageKit upload failed: ${errorData.message || response.statusText}`)
        }

        const data = await response.json()
        return data.url
      } catch (error) {
      
        throw error
      }
    },

    async getImageKitAuthParams() {
      try {
        // Get authentication parameters from your backend
        const response = await axiosInstance.get('/api/users/imagekit-auth')
        return response.data
      } catch (error) {
   
        throw new Error('Failed to authenticate with ImageKit')
      }
    },

    async handleProfileSave() {
      try {
        let profilePictureUrl = this.profilePicturePreview

        // Upload new profile picture if selected
        if (this.selectedProfilePictureFile) {
   
          profilePictureUrl = await this.uploadToImageKit(this.selectedProfilePictureFile)
       
        }

        // Validate password fields
        if (this.newPassword && this.newPassword !== this.confirmPassword) {
          alert('New password and confirmation do not match.')
          return
        }

        // Prepare update payload - only include fields with actual values
        const payload = {}

        // Only include bio if it has content
        if (this.bio && this.bio.trim() !== '') {
          payload.bio = this.bio.trim()
        }

        // Only include profile picture if we have a new URL
        if (profilePictureUrl && profilePictureUrl !== this.defaultProfilePicture) {
          payload.profile_picture = profilePictureUrl
        }

        // Only include password if user wants to change it
        if (this.newPassword && this.newPassword.trim() !== '') {
          payload.password = this.newPassword
        }

        // Check if we have anything to update
        if (Object.keys(payload).length === 0) {
          alert('No changes to save.')
          return
        }

        console.log('Updating profile with payload:', payload)
        
        // Check if user is authenticated
        const authStore = useAuthStore()
        
        const response = await axiosInstance.put('/api/users/profile', payload)

        // Update auth store with new profile picture
        if (payload.profile_picture) {
          useAuthStore().setProfilePicture(profilePictureUrl)
        }

        // Reset form
        this.selectedProfilePictureFile = null
        this.newPassword = ''
        this.confirmPassword = ''
        this.currentPassword = ''
        
        alert('Profile updated successfully!')
      } catch (err) {
        console.error('Profile update error:', err)
        if (err.message.includes('ImageKit')) {
          alert('Failed to upload profile picture. Please check your internet connection and try again.')
        } else {
          alert('Failed to update profile. Please try again.')
        }
      }
    }
  }
}
</script>

<style scoped>
.profile-container.no-scroll {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%);
  display: flex;
  align-items: start;  
  justify-content: center;
  overflow: auto;       
  margin: 0;
  padding: 2rem 1rem;
}

.profile-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 720px;
  width: 90%;       /* increase from 100% to 90% of viewport width */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-card h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #134e4a;
  margin-bottom: 1.5rem;
}
.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}
.profile-picture {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border: 3px solid #0d3d31;
  background: #e0f2f1;
}
.profile-picture-section input[type="file"] {
  margin-top: 0.5rem;
}
.profile-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.input-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #134e4a;
  margin-bottom: 0.1rem;
}
.input-group input,
.input-group textarea {
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1.5px solid #e0e0e0;
  font-size: 1rem;
  background: #f8fafc;
  color: #134e4a;
  transition: border 0.2s;
}
.input-group input:focus,
.input-group textarea:focus {
  border: 1.5px solid #0d3d31;
  outline: none;
}
.save-btn {
  margin-top: 1.2rem;
  padding: 0.9rem 0;
  background: linear-gradient(135deg, #059669 0%, #16a34a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.13);
}
.save-btn:hover {
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  box-shadow: 0 8px 24px rgba(5, 150, 105, 0.18);
}
</style> 