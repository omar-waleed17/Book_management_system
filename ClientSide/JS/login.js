document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim(),
  };


  // OPTION 1 reqeust and response
  
  // try {
  //   const response = await fetch("http://localhost:8080/api/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(loginData),
  //   });

  //   if (!response.ok) throw new Error("Backend login failed");

  //   const data = await response.json();

  //   // Save tokens + metadata from backend response
  //   localStorage.setItem("accessToken", data.accessToken);
  //   localStorage.setItem("refreshToken", data.refreshToken);
  //   localStorage.setItem("username", data.username);
  //   localStorage.setItem("role", data.role);

  //   alert("Login successful via backend! Welcome " + data.username);
  //   window.location.href = "customerdashboard.html";
  //   return; // stop here if backend worked
  // } catch (error) {
  //   console.warn("Backend not available, falling back to LocalStorage:", error);
  // }

  
  // OPTION 2: LocalStorage 

  const savedUser = JSON.parse(localStorage.getItem("signupData"));
  if (!savedUser) {
    alert("No account found locally. Please sign up first.");
    return;
  }

  if (
    loginData.username === savedUser.username &&
    loginData.password === savedUser.password
  ) {
    localStorage.setItem("currentUser", JSON.stringify(savedUser));
    alert("Login successful (LocalStorage)! Welcome " + savedUser.username);
    window.location.href = "customerdashboard.html";
  } else {
    alert("Invalid username or password (LocalStorage check).");
  }
});
/////will handle login either customer or admin