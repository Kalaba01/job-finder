document.addEventListener("DOMContentLoaded", () => {
  const confirmModal = document.getElementById("confirm-modal");
  const confirmYes = document.getElementById("confirm-modal-confirm");
  const confirmNo = document.getElementById("confirm-modal-cancel");

  // Function to open the confirmation modal
  const openConfirmModal = ({ title, message, action, id, onConfirm }) => {
    document.getElementById("confirm-modal-title").textContent = title || "Are you sure?";
    document.getElementById("confirm-modal-message").textContent = message || "This action cannot be undone.";
    confirmYes.dataset.action = action || "";
    confirmYes.dataset.id = id || "";

    confirmYes.onclick = async () => {
      try {
        await onConfirm(id, action);
        closeConfirmModal();
      } catch (error) {
        console.error("Error executing action:", error);
      }
    };

    confirmModal.classList.remove("hidden");
    confirmModal.classList.add("show");
  };

  // Function to close the confirmation modal
  const closeConfirmModal = () => {
    confirmModal.classList.remove("show");
    confirmModal.classList.add("hidden");
    confirmYes.onclick = null;
  };

  // Add click event listener to the "No" button to close the modal
  confirmNo.addEventListener("click", closeConfirmModal);

  // Expose the `openConfirmModal` function to the global `window` object for external use
  window.openConfirmModal = openConfirmModal;
});
