document.querySelector(".signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    username: e.target.username.value.trim(),
    password: e.target.password.value.trim(),
    email: e.target.email.value.trim(),
  };

  // -------------------------------
  // Regex validation
  // -------------------------------
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

 
  // Fake API (practice only)
 
  /*
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log("Fake API signup response:", result);
    alert("Signup request sent to Fake API (not really saved).");
  } catch (error) {
    console.error("Error:", error);
    alert("Could not connect to Fake API.");
  }
  */

  // LocalStorage 

  localStorage.setItem("signupData", JSON.stringify(formData));
  console.log("Saved locally:", formData);
  alert("Signup successful! Data saved in browser.");
});
