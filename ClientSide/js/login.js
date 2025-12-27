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

  try {
    console.log("🔐 Attempting login...");
    
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
    console.log("✅ Login successful:", data);

    // ✅ Save tokens and user info
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    localStorage.setItem("isLoggedIn", "true");

    // Clear saved form data
    sessionStorage.removeItem("loginFormData");

    // ✅ CHECK IF WE SHOULD CREATE CART
    // We'll create cart ONLY if it's the user's first login in this session
    // We use localStorage to track if cart was already created
    
    if (data.role === "CUSTOMER") {
      try {
        const cartCreatedKey = `cartCreated_${data.username}`;
        const cartAlreadyCreated = localStorage.getItem(cartCreatedKey) === "true";
        
        console.log(`🛒 Cart check for ${data.username}:`, cartAlreadyCreated ? 'Already created' : 'Need to create');
        
        if (!cartAlreadyCreated) {
          console.log("🛒 Creating new cart for customer...");
          
          const cartResponse = await fetch('http://localhost:8080/api/customer/cart', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${data.accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Cart creation response status:', cartResponse.status);
          
          if (cartResponse.ok) {
            console.log('✅ Cart created successfully');
            // Mark cart as created for this user
            localStorage.setItem(cartCreatedKey, "true");
          } else if (cartResponse.status === 409) {
            console.log('🔁 Cart already exists in database (409)');
            // Still mark as created since it exists
            localStorage.setItem(cartCreatedKey, "true");
          } else {
            const errorText = await cartResponse.text();
            console.warn('⚠️ Cart creation warning:', cartResponse.status, errorText);
            // Don't mark as created if it failed
          }
        } else {
          console.log('🔄 Cart already marked as created for this user');
        }
      } catch (cartError) {
        console.error('❌ Error with cart check:', cartError);
        // Don't block login
      }
    } else {
      console.log('👤 User is ADMIN, no cart needed');
    }
    
    alert("Login successful! Welcome " + data.username);
    
    // ✅ Redirect based on role
    console.log(`🔄 Redirecting ${data.role} user...`);
    if (data.role.toLowerCase() === "admin") {
      window.location.href = "admindashboard.html";
    } else {
      window.location.href = "customerdashboard.html";
    }
    
  } catch (error) {
    console.error("❌ Login failed:", error);
    alert("Login failed: " + error.message);
  }
});