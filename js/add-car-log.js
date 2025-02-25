// Check for authentication
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

// Back button handler
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/car-logs.html";
});

// Fetch employees for the dropdown
async function fetchEmployees() {
  const BACKEND_BASE_URL = "http://localhost:3000";

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }

    const data = await response.json();
    const select = document.getElementById("assignedEmployee");

    data.data.employees.forEach((employee) => {
      if (employee.active) {
        const option = document.createElement("option");
        option.value = employee._id;
        option.textContent = `${employee.firstName} ${employee.lastName}`;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Form submission handler
document
  .getElementById("addCarLogForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorMessage = document.getElementById("errorMessage");

    const formData = {
      customerName: document.getElementById("customerName").value,
      serviceType: document.getElementById("serviceType").value,
      vehicleInfo: {
        make: document.getElementById("vehicleMake").value,
        model: document.getElementById("vehicleModel").value,
        year: parseInt(document.getElementById("vehicleYear").value),
        color: document.getElementById("vehicleColor").value,
      },
      scheduledDate: document.getElementById("scheduledDate").value,
      assignedEmployee: document.getElementById("assignedEmployee").value,
      price: parseFloat(document.getElementById("price").value),
      notes: document.getElementById("notes").value,
      status: "Scheduled", // Default status for new logs
    };

    try {
      const BACKEND_BASE_URL = "http://localhost:3000";

      const response = await fetch(`${BACKEND_BASE_URL}/api/car-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "../views/car-logs.html";
      } else {
        errorMessage.textContent = data.message || "Failed to add car log";
        errorMessage.classList.remove("hidden");
      }
    } catch (error) {
      errorMessage.textContent = `${error}An error occurred. Please try again.`;
      errorMessage.classList.remove("hidden");
    }
  });

// Set min date for scheduled date to today
const scheduledDateInput = document.getElementById("scheduledDate");
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
scheduledDateInput.min = today.toISOString().slice(0, 16);

// Initial load
fetchEmployees();
