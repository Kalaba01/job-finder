document.addEventListener("DOMContentLoaded", () => {
  const addPhaseBtn = document.getElementById("add-phase-btn");
  const modal = document.getElementById("phase-modal");
  const closeModal = modal.querySelector(".close-modal");
  const phaseForm = document.getElementById("phase-form");
  const phaseNameInput = document.getElementById("phase-name");
  const phaseSequenceInput = document.getElementById("phase-sequence");
  const phaseFinalInput = document.getElementById("phase-final");
  const phaseIdInput = document.getElementById("phase-id");

  const editBtns = document.querySelectorAll(".edit-btn");
  const deleteBtns = document.querySelectorAll(".delete-btn");

  // Initialize notification system (Notyf)
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  // Localization strings
  const localization = {
    confirmDeleteTitle: document.body.dataset.confirmDeleteTitle,
    confirmDeleteMessage: document.body.dataset.confirmDeleteMessage,
    confirmCloseTitle: document.body.dataset.confirmCloseTitle
  };

  // Function to open the modal and populate it if editing a phase
  const openModal = (title, phase = null) => {
    document.getElementById("modal-title").textContent = title;
    if (phase) {
      phaseNameInput.value = phase.name;
      phaseSequenceInput.value = phase.sequence;
      phaseFinalInput.value = phase.isFinal.toString();
      phaseIdInput.value = phase.id;
    } else {
      phaseNameInput.value = "";
      phaseSequenceInput.value = "";
      phaseFinalInput.value = "false";
      phaseIdInput.value = "";
    }
    modal.style.display = "flex";
  };

  // Function to close the modal and reset form inputs
  const closeModalHandler = () => {
    modal.style.display = "none";
    phaseForm.reset();
    phaseIdInput.value = "";
  };

  
  addPhaseBtn.addEventListener("click", () => openModal(localization.confirmCloseTitle));
  closeModal.addEventListener("click", closeModalHandler);

  // Handle form submission for adding or editing a hiring phase
  phaseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = phaseIdInput.value;
    const name = phaseNameInput.value.trim();
    const sequence = parseInt(phaseSequenceInput.value.trim(), 10);
    const isFinal = phaseFinalInput.value === "true";

    const method = id ? "PUT" : "POST";
    const url = id
      ? `/admin/maintenance/hiring-phases/${id}`
      : "/admin/maintenance/hiring-phases";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sequence, isFinal })
    })
      .then((response) => {
        if (response.ok) {
          notyf.success(id ? "Phase updated successfully!" : "Phase added successfully!");
          location.reload();
        }
        else notyf.error("Failed to save the phase.");
      })
      .catch((error) => console.error("Error:", error));
  });

  // Handle the edit action for a phase
  editBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      const id = row.dataset.id;
      const name = row.children[1].textContent.trim();
      const sequence = parseInt(row.children[2].textContent.trim(), 10);
      const isFinal = row.children[3].textContent.trim() === "Yes";
      openModal("Edit Phase", { id, name, sequence, isFinal });
    });
  });

  // Handle the delete action for a phase
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      const id = row.dataset.id;

      openConfirmModal({
        title: localization.confirmDeleteTitle,
        message: localization.confirmDeleteMessage,
        action: "delete",
        id: id,
        onConfirm: async (id) => {
          try {
            const response = await fetch(`/admin/maintenance/hiring-phases/${id}`, { method: "DELETE" });
            if (response.ok) {
              notyf.success("Phase deleted successfully!");
              location.reload();
            }
            else notyf.error("Failed to delete the phase.");
          } catch (error) {
            console.error("Error deleting phase:", error);
            notyf.error("An error occurred while deleting the phase.");
          }
        }
      });
    });
  });
});
