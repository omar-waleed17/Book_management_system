
// LocalStorage

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser && currentUser.username) {
  document.getElementById("customerName").textContent =
    "Welcome, " + currentUser.username;
} else {
  document.getElementById("customerName").textContent = "Welcome, Guest";
}



