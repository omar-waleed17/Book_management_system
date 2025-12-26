// Check authentication before page loads
const role = localStorage.getItem("role");
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true" || role?.toLowerCase() !== "admin") {
  alert("Access denied. Admin privileges required.");
  window.location.href = "../index.html";
}

// Handle logout
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("role");
  window.location.href = "../index.html";
});

// Confirm order function
function confirmOrder(orderId) {
  const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
  const confirmBtn = orderCard.querySelector(".confirm-btn");
  const statusSpan = orderCard.querySelector(".order-status");

  // Change status and styling
  orderCard.classList.add("confirmed");
  statusSpan.textContent = "Confirmed";
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Confirmed ✓";

  // Here you would typically send a request to the backend

  //   console.log(`Order ${orderId} confirmed`);
}
