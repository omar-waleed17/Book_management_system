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

document
  .querySelector(".show-password-btn")
  .addEventListener("click", function () {
    const passwordInput = document.querySelector('input[name="password"]');
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    this.classList.toggle("active");
  });


document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim(),
  };

  // OPTION 1: Backend API
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

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

    // ✅ Save tokens EXACTLY as token.js expects - NO CHANGES HERE!
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);  // "CUSTOMER" or "ADMIN" 
    localStorage.setItem("isLoggedIn", "true");

    sessionStorage.removeItem("loginFormData");

    // Clear saved form data
    alert("Login successful via backend! Welcome " + data.username);
    sessionStorage.removeItem('loginFormData');
     if (localStorage.getItem("role").toLowerCase() === "admin") {
      window.location.href = "admindashboard.html";
    } else window.location.href = "customerdashboard.html";
    return;
    
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed: " + error.message);
  }
});