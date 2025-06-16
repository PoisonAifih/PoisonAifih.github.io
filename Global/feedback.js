class FeedbackSystem {
  constructor() {
    this.init();
  }

  init() {
    this.createContainer();
    this.createModal();
  }

  createContainer() {
    if (document.getElementById("feedback-container")) return;

    const container = document.createElement("div");
    container.id = "feedback-container";
    container.className = "feedback-container";
    document.body.appendChild(container);
  }

  createModal() {
    if (document.getElementById("confirmation-modal")) return;

    const modal = document.createElement("div");
    modal.id = "confirmation-modal";
    modal.className = "confirmation-modal";
    modal.innerHTML = `
      <div class="confirmation-content">
        <div class="confirmation-icon"></div>
        <h3 class="confirmation-title"></h3>
        <p class="confirmation-message"></p>
        <div class="confirmation-buttons">
          <button class="confirm-btn">Confirm</button>
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  toast(message, type = "info", duration = 3000) {
    const toast = this.createToast(message, type);
    this.showToast(toast, duration);
    return toast;
  }

  createToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `feedback-toast feedback-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${this.getIcon(type)}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close">×</button>
    `;

    toast.querySelector(".toast-close").onclick = () => this.hideToast(toast);
    return toast;
  }

  showToast(toast, duration) {
    document.getElementById("feedback-container").appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);

    if (duration > 0) {
      setTimeout(() => this.hideToast(toast), duration);
    }
  }

  hideToast(toast) {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }

  confirm(title, message, onConfirm, onCancel) {
    const modal = document.getElementById("confirmation-modal");
    modal.querySelector(".confirmation-title").textContent = title;
    modal.querySelector(".confirmation-message").textContent = message;

    const confirmBtn = modal.querySelector(".confirm-btn");
    const cancelBtn = modal.querySelector(".cancel-btn");

    const cleanup = () => {
      modal.classList.remove("show");
      confirmBtn.replaceWith(confirmBtn.cloneNode(true));
      cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    };

    modal.querySelector(".confirm-btn").onclick = () => {
      cleanup();
      onConfirm?.();
    };

    modal.querySelector(".cancel-btn").onclick = () => {
      cleanup();
      onCancel?.();
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        cleanup();
        onCancel?.();
      }
    };

    modal.classList.add("show");
  }

  getIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
      loading: "⟳",
    };
    return icons[type] || icons.info;
  }

  success(message, duration = 3000) {
    return this.toast(message, "success", duration);
  }
  error(message, duration = 5000) {
    return this.toast(message, "error", duration);
  }
  warning(message, duration = 4000) {
    return this.toast(message, "warning", duration);
  }
  info(message, duration = 3000) {
    return this.toast(message, "info", duration);
  }
  loading(message) {
    return this.toast(message, "loading", 0);
  }

  removeToast(toast) {
    if (toast && toast.parentNode) {
      this.hideToast(toast);
    }
  }
}

window.feedback = new FeedbackSystem();
