document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim(),
  };

  // OPTION 1: Fake API 
 
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    console.log("Fake API login response:", result);
    // This alert is just to show the request went out
    alert("Login request sent to Fake API (not really checked).");
  } catch (error) {
    console.error("Error:", error);
    alert("Could not connect to Fake API.");
  }



  const savedUser = JSON.parse(localStorage.getItem("signupData"));

  if (!savedUser) {
    alert("No account found in browser. Please sign up first.");
    return;
  }

  if (
    loginData.username === savedUser.username &&
    loginData.password === savedUser.password
  ) {
    alert("Login successful! Welcome " + savedUser.username);


    console.log("User info from LocalStorage:", savedUser);
window.location.href = "customerdashboard.html";

  } else {
    alert("Invalid username or password (LocalStorage check).");
  }
});
