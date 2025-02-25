// Check for authentication
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

// Form submission handler
document
  .getElementById("addEmployeeForm")
  .addEventListener("submit", async (e) => {
    console.log("Form submitted");
    e.preventDefault();
    const errorMessage = document.getElementById("errorMessage");
    const BACKEND_BASE_URL = "http://localhost:3000";

    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      position: document.getElementById("position").value,
    };

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/employees.html";
      } else {
        errorMessage.textContent = data.message || "Failed to add employee";
        errorMessage.classList.remove("hidden");
      }
    } catch (error) {
      errorMessage.textContent = "An error occurred. Please try again.";
      errorMessage.classList.remove("hidden");
    }
  });
