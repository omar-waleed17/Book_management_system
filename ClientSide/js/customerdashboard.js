// LocalStorage

document.addEventListener("DOMContentLoaded", () => {
  const customerNameElement = document.getElementById("customerName");
  
  // Try to get username from backend login (stored separately)
  let username = localStorage.getItem("username");
  
  // Fallback to LocalStorage mode (currentUser object)
  if (!username) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.username) {
      username = currentUser.username;
    }
  }
  
  // Display the username
  if (username) {
    customerNameElement.textContent = `Welcome ${username}`;
  } else {
    customerNameElement.textContent = "Welcome Guest";
  }
});



