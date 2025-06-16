document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitBtn = document.querySelector(".login-submit-btn");

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + "-error");

    field.classList.add("error");
    errorDiv.textContent = message;

    setTimeout(() => {
      field.classList.remove("error");
      errorDiv.textContent = "";
    }, 3000);
  }

  function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.add("success");

    setTimeout(() => {
      field.classList.remove("success");
    }, 2000);
  }

  form.onsubmit = (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;

    if (!email) {
      showError("email", "Email is required");
      feedback.error("Please enter your email");
      return;
    }

    if (!password) {
      showError("password", "Password is required");
      feedback.error("Please enter your password");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.textContent = "Logging in...";

    const loadingToast = feedback.loading("Logging you in...");

    setTimeout(() => {
      submitBtn.classList.remove("loading");
      submitBtn.textContent = "Login";

      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("isAuthenticated", "true");

      feedback.success("Login successful! Redirecting...");

      setTimeout(() => {
        if (role === "parent") {
          window.location.href = "../dashboard/dash.html";
        } else {
          window.location.href = "../babysitter/bshome.html";
        }
      }, 1000);
    }, 1000);
  };

  document.querySelector(".forgot-password").onclick = (e) => {
    e.preventDefault();
    feedback.info("Password reset feature coming soon!");
  };
});
