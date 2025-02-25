// Check for authentication
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

// Back button handler
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/dashboard.html";
});

// Fetch and display employees
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
    const tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = "";

    data.data.employees.forEach((employee) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">
            ${employee.firstName} ${employee.lastName}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${employee.position}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${employee.email}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            employee.active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }">
            ${employee.active ? "Active" : "Inactive"}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button 
            onclick="editEmployee('${employee._id}')"
            class="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            Edit
          </button>
          <button 
            onclick="deleteEmployee('${employee._id}')"
            class="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Delete employee
async function deleteEmployee(id) {
  const BACKEND_BASE_URL = "http://localhost:3000";

  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/employees/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete employee");
    }

    fetchEmployees(); // Refresh the list
  } catch (error) {
    console.error("Error:", error);
  }
}

// Edit employee (redirect to edit page)
function editEmployee(id) {
  window.location.href = `/edit-employee.html?id=${id}`;
}

// Initial load
fetchEmployees();
