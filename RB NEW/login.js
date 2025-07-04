const API_URL = "http://localhost:4000/api"; // Change if your backend is elsewhere

const loginApp = document.getElementById('login-app');
renderLogin();

function renderLogin() {
  loginApp.innerHTML = `
    <div class="login-container">
      <h2>Login</h2>
      <form id="login-form">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login / Register</button>
        <div id="login-error" class="error"></div>
      </form>
    </div>
  `;
  document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    document.getElementById('login-error').textContent = "";
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        // Redirect to main app or builder page
        window.location.href = "index.html"; // Change to your builder page
      } else {
        document.getElementById('login-error').textContent = "Login failed. Try again.";
      }
    } catch {
      document.getElementById('login-error').textContent = "Server error. Try again later.";
    }
  };
}