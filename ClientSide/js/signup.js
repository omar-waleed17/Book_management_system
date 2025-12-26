document.querySelector(".show-password-btn").addEventListener("click", function() {
  const passwordInput = document.querySelector('input[name="password"]');
  const isPassword = passwordInput.type === "password";
  
  passwordInput.type = isPassword ? "text" : "password";
  this.classList.toggle("active");
});

document.querySelector(".signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim(),
    firstName: e.target.firstName.value.trim(),
    lastName: e.target.lastName.value.trim(),
    email: e.target.email.value.trim(),
    phoneNumber: e.target.phone.value.trim(),
    shippingAddress: e.target.address.value.trim()
  };


  const usernameRegex = /^[a-zA-Z0-9_@#]{3,25}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;

  if (!usernameRegex.test(formData.username)) {
    alert("Username must be 3–25 characters (letters, numbers, _, @, #).");
    return;
  }
  if (!passwordRegex.test(formData.password)) {
    alert("Password must be at least 8 characters with at least one letter and one number.");
    return;
  }
  if (!nameRegex.test(formData.firstName)) {
    alert("First name must contain only letters and spaces (2-50 characters).");
    return;
  }
  if (!nameRegex.test(formData.lastName)) {
    alert("Last name must contain only letters and spaces (2-50 characters).");
    return;
  }
  if (!emailRegex.test(formData.email)) {
    alert("Please enter a valid email address.");
    return;
  }


  // API BLOCK 

  try {
    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Backend signup failed");

    const result = await response.json();
    console.log("Backend signup response:", result);

    // Auto-login after successful signup
    // try {
    //   const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       username: formData.username,
    //       password: formData.password
    //     }),
    //   });

    //   if (loginResponse.ok) {
    //     const loginData = await loginResponse.json();
        
    //     // Save tokens + metadata from backend response
    //     localStorage.setItem("accessToken", loginData.accessToken);
    //     localStorage.setItem("refreshToken", loginData.refreshToken);
    //     localStorage.setItem("username", loginData.username);
    //     localStorage.setItem("role", loginData.role);
    //     localStorage.setItem("isLoggedIn", "true");

    //     alert("Account created successfully! Welcome " + loginData.username);
    //     window.location.href = "customerdashboard.html";
    //     return;
    //   }
    // } catch (loginError) {
    //   console.warn("Auto-login failed:", loginError);
    //   alert("Signup successful! Please log in.");
    //   window.location.href = "login.html";
    //   return;
    // }
  } catch (error) {
    console.warn("Backend not available, falling back to LocalStorage:", error);
  }

  // LocalStorage fallback - also auto-login
  localStorage.setItem("signupData", JSON.stringify(formData));
  localStorage.setItem("currentUser", JSON.stringify(formData));
  localStorage.setItem("isLoggedIn", "true");
  console.log("Saved locally:", formData);
  
  // Clear sessionStorage after successful signup
  sessionStorage.removeItem('signupFormData');
  
  alert("Account created successfully! Welcome " + formData.username);
  window.location.href = "customerdashboard.html";
  }
);

// Restore form data from sessionStorage on page load
// window.addEventListener('DOMContentLoaded', () => {
//   const savedFormData = sessionStorage.getItem('signupFormData');
//   if (savedFormData) {
//     const formData = JSON.parse(savedFormData);
//     const form = document.querySelector('.signup-form');
    
//     if (formData.username) form.username.value = formData.username;
//     if (formData.password) form.password.value = formData.password;
//     if (formData.firstName) form.firstName.value = formData.firstName;
//     if (formData.lastName) form.lastName.value = formData.lastName;
//     if (formData.email) form.email.value = formData.email;
//     if (formData.phone) form.phone.value = formData.phone;
//     if (formData.address) form.address.value = formData.address;
//   }
// });

// Save form data to sessionStorage as user types
// document.querySelector('.signup-form').addEventListener('input', (e) => {
//   const form = e.currentTarget;
//   const formData = {
//     username: form.username.value,
//     password: form.password.value,
//     firstName: form.firstName.value,
//     lastName: form.lastName.value,
//     email: form.email.value,
//     phone: form.phone.value,
//     address: form.address.value
//   };
//   sessionStorage.setItem('signupFormData', JSON.stringify(formData));
// }


// );
