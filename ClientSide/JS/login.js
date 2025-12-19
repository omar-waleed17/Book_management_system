document.querySelector(".login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    username: e.target.username.value,
    password: e.target.password.value,
  };

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    console.log("Fake API login response:", result);
    alert("Login request sent to Fake API (not really checked).");
  } catch (error) {
    console.error("Error:", error);
    alert("Could not connect to Fake API.");
  }
});
