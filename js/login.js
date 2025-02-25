document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard.html";
    } else {
      errorMessage.textContent = data.message;
      errorMessage.classList.remove("hidden");
    }
  } catch (error) {
    errorMessage.textContent = "An error occurred. Please try again.";
    errorMessage.classList.remove("hidden");
  }
});
