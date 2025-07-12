<template>
  <div class="profile-container no-scroll">
    <div class="profile-card">
      <h2>My Profile</h2>
      <div class="profile-picture-section">
        <img :src="profilePicturePreview || defaultProfilePicture" class="profile-picture" alt="Profile Picture" />
        <input type="file" accept="image/*" @change="onProfilePictureChange" />
      </div>
      <form @submit.prevent="handleProfileSave" class="profile-form">
        <div class="input-group">
          <label for="bio">Bio</label>
          <textarea id="bio" v-model="bio" placeholder="Tell us about yourself..." rows="3"></textarea>
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
export default {
  data() {
    return {
      bio: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      profilePicturePreview: '',
      defaultProfilePicture: 'https://ui-avatars.com/api/?name=User&background=0d3d31&color=fff&size=128',
    };
  },
  methods: {
    onProfilePictureChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.profilePicturePreview = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleProfileSave() {
      // Add validation and API calls here
      alert('Profile changes saved! (Implement API integration)');
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
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.profile-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 420px;
  width: 100%;
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