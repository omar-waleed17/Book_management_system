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
    sessionStorage.removeItem('loginFormData');

    // ✅ Check role in UPPERCASE (backend returns "CUSTOMER"/"ADMIN")
    if (data.role === "CUSTOMER") {
      window.location.href = "../Pages/customerdashboard.html";
    } else if (data.role === "ADMIN") {
      window.location.href = "../Pages/admindashboard.html";
    } else {
      // Default fallback
      window.location.href = "../Pages/customerdashboard.html";
    }
    
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed: " + error.message);
  }
});