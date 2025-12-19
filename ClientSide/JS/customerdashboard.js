
const currentUser = JSON.parse(localStorage.getItem("signupData"));

if (currentUser && currentUser.username) {
  document.getElementById("customerName").textContent = "Welcome, " + currentUser.username;
}
