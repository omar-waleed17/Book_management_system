document.addEventListener("DOMContentLoaded", () => {
  const usernameField   = document.getElementById("username");
  const firstNameField  = document.getElementById("firstName");
  const lastNameField   = document.getElementById("lastName");
  const emailField      = document.getElementById("email");
  const phoneField      = document.getElementById("phone");
  const addressField    = document.getElementById("address");
  const passwordField   = document.getElementById("password");

  // API 
//   async function loadProfileFromAPI() {
//     const token = localStorage.getItem("accessToken");
//     const response = await fetch("http://localhost:8080/api/customer/profile", {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     if (!response.ok) throw new Error("Backend not available");

//     const data = await response.json();

//     usernameField.value   = data.username;
//     firstNameField.value  = data.firstName;
//     lastNameField.value   = data.lastName;
//     emailField.value      = data.email;
//     phoneField.value      = data.phoneNumber;
//     addressField.value    = data.shippingAddress;
  
//   }
//   */


//   LocalStorage  (testing)
 
  const savedUser = JSON.parse(localStorage.getItem("signupData"));
  if (savedUser) {
    usernameField.value   = savedUser.username       || "";
    firstNameField.value  = savedUser.firstName      || "";
    lastNameField.value   = savedUser.lastName       || "";
    emailField.value      = savedUser.email          || "";
    phoneField.value      = savedUser.phoneNumber    || "";
    addressField.value    = savedUser.shippingAddress|| "";
  }


  // Save changes
document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
      username: usernameField.value.trim(), 
      firstName: firstNameField.value.trim(),
      lastName: lastNameField.value.trim(),
      email: emailField.value.trim(),
      phoneNumber: phoneField.value.trim(),
      shippingAddress: addressField.value.trim(),
      password: passwordField.value.trim() 
    };

    
    // API 
  
    // try {
    //   const token = localStorage.getItem("accessToken");
    //   const response = await fetch("http://localhost:8080/api/customer/profile", {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`
    //     },
    //     body: JSON.stringify(updatedData)
    //   });

    //   if (!response.ok) throw new Error("Update failed");

    //   alert("Profile updated successfully (backend).");
    // } catch (error) {
    //   alert("Profile update failed.");
    // }
    // */

    // LocalStorage
    localStorage.setItem("signupData", JSON.stringify(updatedData));
    alert("Profile updated locally (testing mode).");
  });
});
