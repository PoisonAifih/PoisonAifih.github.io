document.addEventListener("DOMContentLoaded", function () {
  fetch("../Global/DashboardBb.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("dashboard-container").innerHTML = html;

      if (typeof setupNotificationDropdowns === "function") {
        setupNotificationDropdowns();
      } else {
        console.warn("setupNotificationDropdowns not found!");
      }

      return fetch("../Global/SideBb.html");
    })
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sidebar-container").innerHTML = html;
      setTimeout(() => utils.setupSidebarToggle(), 100);
      initializeOrders();
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });

  function initializeOrders() {
    document.querySelectorAll(".order-card").forEach((card) => {
      const orderId = card.getAttribute("data-id");
      const savedStatus =
        localStorage.getItem(`order_${orderId}_status`) || "pending";

      card.setAttribute("data-status", savedStatus);
      card.classList.remove(
        "status-pending",
        "status-finished",
        "status-cancelled"
      );
      card.classList.add(`status-${savedStatus}`);

      if (savedStatus !== "pending") {
        const actionButtons = card.querySelector(".action-buttons");
        if (actionButtons) {
          actionButtons.style.display = "none";
        }
      }
      const finishBtn = card.querySelector(".btn-finish");
      if (finishBtn) {
        finishBtn.addEventListener("click", function () {
          showConfirmationModal(
            "Finish Order",
            "Are you sure you want to finish this order?",
            () => saveOrderStatus(orderId, "finished")
          );
        });
      }

      const cancelBtn = card.querySelector(".btn-cancel");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
          showConfirmationModal(
            "Cancel Order",
            "Are you sure you want to cancel this order?",
            () => saveOrderStatus(orderId, "cancelled")
          );
        });
      }
    });
  }

  function saveOrderStatus(orderId, status) {
    localStorage.setItem(`order_${orderId}_status`, status);

    const cards = document.querySelectorAll(
      `.order-card[data-id="${orderId}"]`
    );
    cards.forEach((card) => {
      card.setAttribute("data-status", status);
      card.classList.remove(
        "status-pending",
        "status-finished",
        "status-cancelled"
      );
      card.classList.add(`status-${status}`);

      const actionButtons = card.querySelector(".action-buttons");
      if (actionButtons) {
        actionButtons.style.display = "none";
      }
    });
  }

  function showConfirmationModal(title, message, onConfirm) {
    const modal = document.getElementById("confirmationModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelModalBtn");
    const closeBtn = modal.querySelector(".close");

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = "block";

    // Remove existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Add new event listeners
    newConfirmBtn.addEventListener("click", function () {
      onConfirm();
      closeModal();
    });

    newCancelBtn.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);

    // Close modal when clicking outside
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  function closeModal() {
    const modal = document.getElementById("confirmationModal");
    modal.style.display = "none";
  }
});
