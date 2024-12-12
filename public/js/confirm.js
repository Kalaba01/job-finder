document.addEventListener("DOMContentLoaded", () => {
  const confirmModal = document.getElementById("confirm-modal");
  const confirmYes = document.getElementById("confirm-modal-confirm");
  const confirmNo = document.getElementById("confirm-modal-cancel");

  // Otvori modal sa dinamičkim sadržajem
  const openConfirmModal = ({ title, message, action, id, onConfirm }) => {
    document.getElementById("confirm-modal-title").textContent =
      title || "Are you sure?";
    document.getElementById("confirm-modal-message").textContent =
      message || "This action cannot be undone.";
    confirmYes.dataset.action = action || "";
    confirmYes.dataset.id = id || "";

    // Dodaj funkciju za potvrdu
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

  // Zatvori modal
  const closeConfirmModal = () => {
    confirmModal.classList.remove("show");
    confirmModal.classList.add("hidden");
    confirmYes.onclick = null; // Resetuj onclick handler
  };

  // Obradi klik na "No"
  confirmNo.addEventListener("click", closeConfirmModal);

  // Izvoz funkcije za otvaranje modala
  window.openConfirmModal = openConfirmModal;
});
