document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const submitBtn = document.querySelector(".register-submit-btn");

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

  document.getElementById("firstName").addEventListener("blur", function () {
    const firstName = this.value.trim();
    if (firstName && !validateName(firstName)) {
      showFieldError(
        "firstName",
        "First name must be at least 2 characters and contain only letters"
      );
    } else if (firstName) {
      showFieldSuccess("firstName");
    }
  });

  document.getElementById("lastName").addEventListener("blur", function () {
    const lastName = this.value.trim();
    if (lastName && !validateName(lastName)) {
      showFieldError(
        "lastName",
        "Last name must be at least 2 characters and contain only letters"
      );
    } else if (lastName) {
      showFieldSuccess("lastName");
    }
  });
  registerForm.onsubmit = function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;
    const terms = document.getElementById("terms").checked;

    if (!firstName) {
      showError("firstName", "First name is required");
      feedback.error("Please enter your first name");
      return;
    }

    if (!lastName) {
      showError("lastName", "Last name is required");
      feedback.error("Please enter your last name");
      return;
    }

    if (!email) {
      showError("email", "Email is required");
      feedback.error("Please enter your email");
      return;
    }

    if (!password) {
      showError("password", "Password is required");
      feedback.error("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      showError("confirmPassword", "Passwords do not match");
      feedback.error("Passwords do not match");
      return;
    }

    if (!terms) {
      showError("terms", "You must agree to the terms");
      feedback.error("Please agree to the terms and conditions");
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.textContent = "Creating Account...";

    const loadingToast = feedback.loading("Creating your account...");

    setTimeout(() => {
      submitBtn.classList.remove("loading");
      submitBtn.textContent = "Create Account";
      feedback.removeToast(loadingToast);

      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("isAuthenticated", "true");

      feedback.success(`Welcome ${firstName}! Account created successfully!`);

      setTimeout(() => {
        if (role === "parent") {
          window.location.href = "../dashboard/dash.html";
        } else {
          window.location.href = "../babysitter/bshome.html";
        }
      }, 1500);
    }, 1500);
  };
  document.querySelector('a[href="#"]').onclick = function (e) {
    e.preventDefault();
    feedback.info("Terms and conditions coming soon!");
  };
});
