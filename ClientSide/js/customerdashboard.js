// customerdashboard.js - SIMPLE
document.addEventListener('DOMContentLoaded', function() {
  // 1. Check if logged in
  if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }
  
  // 2. Display username
  const username = window.TokenManager.getUsername();
  const welcomeElement = document.getElementById('customerName');
  
  if (username) {
    welcomeElement.textContent = `Welcome, ${username}`;
  } else {
    welcomeElement.textContent = 'Welcome!';
  }
  
  // 3. Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      window.TokenManager.logout();
    });
  }
});