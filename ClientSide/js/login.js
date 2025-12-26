// Restore form data from sessionStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedFormData = sessionStorage.getItem("loginFormData");
  if (savedFormData) {
    const formData = JSON.parse(savedFormData);
    const form = document.querySelector(".login-form");

    if (formData.username) form.username.value = formData.username;
    if (formData.password) form.password.value = formData.password;
  }
});

// Save form data to sessionStorage as user types
document.querySelector(".login-form").addEventListener("input", (e) => {
  const form = e.currentTarget;
  const formData = {
    username: form.username.value,
    password: form.password.value,
  };
  sessionStorage.setItem("loginFormData", JSON.stringify(formData));
});

// Toggle password visibility
document
  .querySelector(".show-password-btn")
  .addEventListener("click", function () {
    const passwordInput = document.querySelector('input[name="password"]');
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    this.classList.toggle("active");
  });

//onlogin submission
document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim(),
  };

  console.log("Attempting login with:", { username: loginData.username });

  // OPTION 1: Backend API
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok) {
      // 401 means wrong credentials, not server error
      if (response.status === 401) {
        alert(data.message || "Invalid username or password");
        return;
        1; // Stop here, don't fall back to LocalStorage
      }
      throw new Error("Backend server error");
    }

    // Save tokens + metadata from backend response
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    localStorage.setItem("isLoggedIn", "true");

    sessionStorage.removeItem("loginFormData");

    alert("Login successful via backend! Welcome " + data.username);
    if (localStorage.getItem("role").toLowerCase() === "admin") {
      window.location.href = "admindashboard.html";
    } else window.location.href = "customerdashboard.html";
    return;
  } catch (error) {
    console.error("Backend error:", error);
    // Only fall back if backend is completely unavailable (not 401)
    if (error.message === "Failed to fetch") {
      console.warn("Backend not available, trying LocalStorage...");
    } else {
      return; // Stop if it's any other error
    }
  }

  // OPTION 2: LocalStorage fallback (only if backend is down)
  const savedUser = JSON.parse(localStorage.getItem("signupData") || "null");
  if (!savedUser) {
    alert(
      "Backend unavailable and no local account found. Please try again later."
    );
    return;
  }

  if (
    loginData.username === savedUser.username &&
    loginData.password === savedUser.password
  ) {
    localStorage.setItem("currentUser", JSON.stringify(savedUser));
    localStorage.setItem("isLoggedIn", "true");
    sessionStorage.removeItem("loginFormData");

    alert("Login successful (LocalStorage)! Welcome " + savedUser.username);
    window.location.href = "customerdashboard.html";
  } else {
    alert("Invalid username or password.");
  }
});
/////will handle login either customer or admin
