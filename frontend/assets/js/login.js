const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const submitButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  submitButton.disabled = true;
  submitButton.textContent = "Signing in...";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const result = await api.post("/login", { username, password });
    auth.setLoggedIn();
    window.location.href = "/frontend/admin.html";
  } catch (error) {
    errorMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Sign In";
  }
});