// token.js - COMPLETE TOKEN MANAGER WITH AUTO-REFRESH
const TokenManager = {
  // ============================================
  // 1. CHECK LOGIN STATUS
  // ============================================
  isLoggedIn: function() {
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  
  // ============================================
  // 2. GET USERNAME
  // ============================================
  getUsername: function() {
    return localStorage.getItem('username');
  },
  
  // ============================================
  // 3. GET USER ROLE
  // ============================================
  getRole: function() {
    return localStorage.getItem('role') || 'CUSTOMER';
  },
  
  // ============================================
  // 4. GET ACCESS TOKEN
  // ============================================
  getToken: function() {
    return localStorage.getItem('accessToken');
  },
  
  // ============================================
  // 5. GET REFRESH TOKEN
  // ============================================
  getRefreshToken: function() {
    return localStorage.getItem('refreshToken');
  },
  
  // ============================================
  // 6. REFRESH ACCESS TOKEN (CALLS /api/auth/refresh)
  // ============================================
  refreshAccessToken: async function() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        console.log('❌ No refresh token available');
        return false;
      }
      
      console.log('🔄 Refreshing access token...');
      const response = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        console.log('❌ Refresh token invalid or expired');
        return false;
      }
    } catch (error) {
      console.error('🚨 Token refresh failed:', error);
      return false;
    }
  },
  
  // ============================================
  // 7. SMART FETCH WITH AUTO-REFRESH
  // ============================================
  fetchWithAuth: async function(url, options = {}) {
    const token = this.getToken();
    
    // Setup headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add token if exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // First attempt
    let response = await fetch(url, { ...options, headers });
    
    // Check if token expired (401 Unauthorized)
    if (response.status === 401) {
      console.log('⚠️ Token expired, trying to refresh...');
      
      // Try to refresh token
      const refreshed = await this.refreshAccessToken();
      
      if (refreshed) {
        // Retry with new token
        const newToken = this.getToken();
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        // Refresh failed - logout user
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
    }
    
    return response;
  },
  
  // ============================================
  // 8. LOGOUT (CALLS /api/auth/logout)
  // ============================================
  logout: async function() {
    try {
      // Get refresh token
      const refreshToken = this.getRefreshToken();
      
      // Tell backend to invalidate tokens
      if (refreshToken) {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.warn('⚠️ Backend logout failed (still clearing frontend):', error);
    }
    
    // Always clear frontend tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
     console.log("outbabe")
    // Redirect to login page
    
    window.location.href = 'login.html';
 
  },
  
  // ============================================
  // 9. GET ALL USER INFO
  // ============================================
  getUserInfo: function() {
    return {
      username: this.getUsername(),
      role: this.getRole(),
      isLoggedIn: this.isLoggedIn()
    };
  },
  
  // ============================================
  // 10. CHECK IF TOKEN IS ABOUT TO EXPIRE
  // ============================================
  isTokenExpiringSoon: function() {
    // Optional: You could add JWT expiration check here
    // For now, just return false
    return false;
  }
};

// Make available globally
window.TokenManager = TokenManager;

console.log('✅ TokenManager loaded successfully');