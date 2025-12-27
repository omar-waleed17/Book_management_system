document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim(),
  };

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

    // ✅ Save tokens EXACTLY as token.js expects - NO CHANGES HERE!
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);  // "CUSTOMER" or "ADMIN" 
    localStorage.setItem("isLoggedIn", "true");

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