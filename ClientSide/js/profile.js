// profile.js - COMPLETE FILE
document.addEventListener('DOMContentLoaded', async function() {
  // 1. Check if logged in
  if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
    window.location.href = "../index.html";
    return;
  }
  
  // 2. Load current profile data
  await loadProfile();
  
  // 3. Setup form submit
  const form = document.getElementById('profileForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      await updateProfile();
    });
  }
});

// ============================================
// LOAD PROFILE FROM BACKEND
// ============================================
async function loadProfile() {
  try {
    console.log('🔍 Loading profile...');
    
    // Get username from TokenManager
    const username = window.TokenManager.getUsername();
    if (username) {
      document.getElementById('username').value = username;
      document.getElementById('username').disabled = true; // Username can't be edited
    }
    
    // Use TokenManager.fetchWithAuth - handles token refresh automatically!
    const response = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/customer/profile'
    );
    
    if (response.ok) {
      const userData = await response.json();
      
      // Fill form fields
      document.getElementById('firstName').value = userData.firstName || '';
      document.getElementById('lastName').value = userData.lastName || '';
      document.getElementById('email').value = userData.email || '';
      document.getElementById('email').disabled = true; // Email can't be edited
      document.getElementById('phone').value = userData.phoneNumber || '';
      document.getElementById('address').value = userData.shippingAddress || '';
      document.getElementById('password').value = ''; // Password field always empty
      
      console.log('✅ Profile loaded');
    } else {
      console.log('❌ Failed to load profile');
      alert('Could not load profile data');
    }
    
  } catch (error) {
    console.error('❌ Error loading profile:', error);
    alert('Error: ' + error.message);
  }
}

// ============================================
// UPDATE PROFILE
// ============================================
async function updateProfile() {
  try {
    console.log('💾 Saving profile...');
    
    // Get updated values
    const updatedData = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      phoneNumber: document.getElementById('phone').value.trim(),
      shippingAddress: document.getElementById('address').value.trim(),
      email: document.getElementById('email').value.trim() // Include email even though disabled
    };
    
    // Add password ONLY if user entered something
    const newPassword = document.getElementById('password').value.trim();
    if (newPassword) {
      updatedData.password = newPassword;
    }
    // If password empty, don't send password field
    
    // Validate required fields
    if (!updatedData.firstName || !updatedData.lastName || !updatedData.email) {
      alert('First name, last name, and email are required');
      return;
    }
    
    // Use TokenManager.fetchWithAuth - handles token refresh automatically!
    const response = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/customer/profile',
      {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      }
    );
    
    if (response.ok) {
      const result = await response.json();
      
      // Clear password field after successful update
      document.getElementById('password').value = '';
      
      // Show success message
      alert('✅ Profile updated successfully!');
      
      // Optional: Reload profile to confirm changes
      console.log('🔄 Reloading profile...');
      await loadProfile();
      
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Update failed');
    }
    
  } catch (error) {
    console.error('❌ Update error:', error);
    alert('Update failed: ' + error.message);
  }
}

// ============================================
// OPTIONAL: Add some basic validation
// ============================================
function setupValidation() {
  const passwordField = document.getElementById('password');
  if (passwordField) {
    // Show password strength hint
    passwordField.addEventListener('input', function() {
      const pass = this.value;
      if (pass.length > 0 && pass.length < 8) {
        this.style.borderColor = 'orange';
      } else if (pass.length >= 8) {
        this.style.borderColor = 'green';
      } else {
        this.style.borderColor = '';
      }
    });
  }
}

// Initialize validation
setupValidation();