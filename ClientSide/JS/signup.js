document.querySelector(".signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    username: e.target.username.value,
    password: e.target.password.value,
    email: e.target.email.value,
  };

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
});
