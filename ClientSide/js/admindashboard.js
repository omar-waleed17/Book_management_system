// Check if user is admin, redirect to index.html if not
document.addEventListener("DOMContentLoaded", () => {
const role = localStorage.getItem("role");
const isLoggedIn = localStorage.getItem("isLoggedIn");

// Check if user is logged in and has admin role
if (!isLoggedIn || role?.toLowerCase() !== "admin") {
  alert("Access denied. Admin privileges required.");
  window.location.href = "../index.html";
}

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
});

const customerNameElement = document.getElementById("customerName");
let username = localStorage.getItem("username");

if (username) {
    customerNameElement.textContent = `Welcome ${username}`;
  } else {
    customerNameElement.textContent = "Welcome ADMIN";
  }

});