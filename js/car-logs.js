// Check for authentication
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login.html";
}

// State management
let currentPage = 1;
let pageSize = 10;
let totalResults = 0;

// Event listeners
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/dashboard.html";
});

document.getElementById("addNewBtn").addEventListener("click", () => {
  window.location.href = "../views/add-car-log.html";
});

document.getElementById("statusFilter").addEventListener("change", () => {
  currentPage = 1;
  fetchCarLogs();
});

document.getElementById("dateFilter").addEventListener("change", () => {
  currentPage = 1;
  fetchCarLogs();
});

document.getElementById("pageSize").addEventListener("change", (e) => {
  pageSize = parseInt(e.target.value);
  currentPage = 1;
  fetchCarLogs();
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchCarLogs();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage * pageSize < totalResults) {
    currentPage++;
    fetchCarLogs();
  }
});

// Fetch and display car logs
async function fetchCarLogs() {
  const BACKEND_BASE_URL = "http://localhost:3000";

  try {
    const status = document.getElementById("statusFilter").value;
    const date = document.getElementById("dateFilter").value;

    const queryParams = new URLSearchParams({
      page: currentPage,
      limit: pageSize,
      ...(status && { status }),
      ...(date && { date }),
    });

    const response = await fetch(
      `${BACKEND_BASE_URL}/api/car-logs?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch car logs");
    }

    const data = await response.json();
    totalResults = data.pagination.totalResults;

    updatePagination(data.pagination);
    renderCarLogs(data.data.carLogs);
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderCarLogs(carLogs) {
  const tableBody = document.getElementById("carLogTableBody");
  tableBody.innerHTML = "";

  carLogs.forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${log.customerName}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">
          ${log.vehicleInfo.year} ${log.vehicleInfo.make} ${
      log.vehicleInfo.model
    }
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${log.serviceType}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
          log.status
        )}">
          ${log.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">
          ${new Date(log.scheduledDate).toLocaleDateString()}
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onclick="editCarLog('${log._id}')"
          class="text-indigo-600 hover:text-indigo-900 mr-4"
        >
          Edit
        </button>
        <button 
          onclick="deleteCarLog('${log._id}')"
          class="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function updatePagination(pagination) {
  document.getElementById("startRange").textContent =
    (currentPage - 1) * pageSize + 1;
  document.getElementById("endRange").textContent = Math.min(
    currentPage * pageSize,
    pagination.totalResults
  );
  document.getElementById("totalResults").textContent = pagination.totalResults;

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled =
    currentPage * pageSize >= pagination.totalResults;
}

function getStatusColor(status) {
  const colors = {
    Scheduled: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// Delete car log
async function deleteCarLog(id) {
  if (!confirm("Are you sure you want to delete this car log?")) return;

  try {
    const response = await fetch(`/api/car-logs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete car log");
    }

    fetchCarLogs(); // Refresh the list
  } catch (error) {
    console.error("Error:", error);
  }
}

// Edit car log (redirect to edit page)
function editCarLog(id) {
  window.location.href = `/edit-car-log.html?id=${id}`;
}

// Initial load
fetchCarLogs();
