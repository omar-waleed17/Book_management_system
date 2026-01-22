// profile.js - COMPLETE PROFILE MANAGEMENT
document.addEventListener('DOMContentLoaded', async function() {
  // 1. Check if logged in
  if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
    window.location.href = "../index.html";
    return;
  }
  
  console.log('👤 Profile page loaded');
  
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
// GET PROFILE - GET /api/customer/profile
// ============================================
async function loadProfile() {
  try {
    console.log('📥 Loading profile data...');
    
    // Use TokenManager.fetchWithAuth for authenticated request
    const response = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/customer/profile',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('Profile GET response status:', response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ Profile data:', userData);
      
      // Fill form fields - adjust these IDs to match your HTML
      const username = document.getElementById('username');
      const firstName = document.getElementById('firstName');
      const lastName = document.getElementById('lastName');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const address = document.getElementById('address');
      const password = document.getElementById('password');
      
      if (username) {
        const storedUsername = window.TokenManager.getUsername();
        username.value = storedUsername || userData.username || '';
        username.disabled = true;
      }
      
      if (firstName) firstName.value = userData.firstName || '';
      if (lastName) lastName.value = userData.lastName || '';
      if (email) {
        email.value = userData.email || '';
        email.disabled = true; // Email usually can't be changed
      }
      if (phone) phone.value = userData.phoneNumber || '';
      if (address) address.value = userData.shippingAddress || '';
      if (password) password.value = ''; // Always empty for security
      
      console.log('✅ Profile loaded successfully');
      
    } else if (response.status === 404) {
      console.log('⚠️ No profile found (first time user)');
      // Keep form empty - user needs to create profile
      
    } else {
      console.error('❌ Failed to load profile:', response.status);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      alert('Could not load profile data');
    }
    
  } catch (error) {
    console.error('❌ Error loading profile:', error);
    alert('Error loading profile: ' + error.message);
  }
}

// ============================================
// UPDATE PROFILE - PUT /api/customer/profile
// ============================================
async function updateProfile() {
  try {
    console.log('💾 Saving profile updates...');
    
    // Collect form data
    const updatedData = {
      firstName: getValue('firstName'),
      lastName: getValue('lastName'),
      email: getValue('email'),
      phoneNumber: getValue('phone') || null,
      shippingAddress: getValue('address') || null
    };
    
    // Add password only if provided
    const newPassword = getValue('password');
    if (newPassword && newPassword.trim()) {
      updatedData.password = newPassword.trim();
    }
    
    // Validate required fields
    if (!updatedData.firstName || !updatedData.lastName || !updatedData.email) {
      alert('First name, last name, and email are required');
      return;
    }
    
    console.log('📤 Sending PUT request with data:', updatedData);
    
    // PUT request to update profile
    const response = await window.TokenManager.fetchWithAuth(
      'http://localhost:8080/api/customer/profile',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      }
    );
    
    console.log('📥 PUT response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Profile update successful:', result);
      
      // Clear password field
      const passwordField = document.getElementById('password');
      if (passwordField) passwordField.value = '';
      
      // Show success message
      showMessage('✅ Profile updated successfully!', 'success');
      
      // Optional: Reload to confirm
      setTimeout(() => {
        loadProfile();
      }, 1000);
      
    } else {
      // Handle error response
      let errorMessage = 'Update failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || 'Update failed';
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || 'Update failed';
      }
      
      console.error('❌ Update failed:', errorMessage);
      showMessage('❌ ' + errorMessage, 'error');
    }
    
  } catch (error) {
    console.error('❌ Update error:', error);
    showMessage('❌ Update failed: ' + error.message, 'error');
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getValue(elementId) {
  const element = document.getElementById(elementId);
  return element ? element.value.trim() : '';
}

function showMessage(text, type) {
  // Simple message display
  const message = document.createElement('div');
  message.textContent = text;
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 5px;
    z-index: 1000;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
  }, 3000);
}

// ============================================
// PASSWORD VALIDATION (optional)
// ============================================
function setupPasswordValidation() {
  const passwordField = document.getElementById('password');
  if (!passwordField) return;
  
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

// Initialize
setupPasswordValidation();