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


  const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!usernameRegex.test(formData.username)) {
    alert("Username must be 3–15 letters/numbers only.");
    return;
  }
  if (!passwordRegex.test(formData.password)) {
    alert("Password must be at least 8 chars, with letters and numbers.");
    return;
  }
  if (!emailRegex.test(formData.email)) {
    alert("Please enter a valid email address.");
    return;
  }


  // API BLOCK 
-
  /*
  try {
    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Backend signup failed");

    const result = await response.json();
    console.log("Backend signup response:", result);

    alert("Signup successful via backend! Please log in.");
    window.location.href = "login.html";
    return; // stop here if backend worked
  } catch (error) {
    console.warn("Backend not available, falling back to LocalStorage:", error);
  }
  */


  // LocalStorage 
 
  localStorage.setItem("signupData", JSON.stringify(formData));
  console.log("Saved locally:", formData);
  alert("Signup successful (saved in browser). Now you can log in!");
});
