document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("status-filter");
  const cards = document.querySelectorAll(".card");
  const searchInput = document.getElementById("search-input");
  const requestGrid = document.querySelector(".request-grid");

  // Preuzimanje lokalizacija iz `data-` atributa
  const localizations = {
    approveTitle: document.body.dataset.approveTitle,
    approveMessage: document.body.dataset.approveMessage,
    rejectTitle: document.body.dataset.rejectTitle,
    rejectMessage: document.body.dataset.rejectMessage,
    yes: document.body.dataset.yes,
    no: document.body.dataset.no,
  };

  // Otvori univerzalni modal
  const openConfirmModal = ({ titleKey, messageKey, action, id }) => {
    const confirmModal = document.getElementById("confirm-modal");
    const confirmTitle = document.getElementById("confirm-modal-title");
    const confirmMessage = document.getElementById("confirm-modal-message");
    const confirmYes = document.getElementById("confirm-modal-confirm");
    const confirmNo = document.getElementById("confirm-modal-cancel");

    confirmTitle.textContent = localizations[titleKey] || "Are you sure?";
    confirmMessage.textContent = localizations[messageKey] || "This action cannot be undone.";

    // Postavi tekst za "Yes" i "No" dugmad
    confirmYes.textContent = localizations.yes || "Yes";
    confirmNo.textContent = localizations.no || "No";

    // Postavi akciju na "Yes" dugme
    confirmYes.onclick = async () => {
      try {
        const response = await fetch("/admin/company-approvals/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: action }),
        });

        if (response.ok) {
          alert("Action completed successfully!");
          location.reload();
        } else {
          alert("Action failed.");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        closeConfirmModal();
      }
    };

    // Zatvori modal na "No" klik
    confirmNo.onclick = closeConfirmModal;

    confirmModal.classList.remove("hidden");
    confirmModal.classList.add("show");
  };

  // Zatvori modal
  const closeConfirmModal = () => {
    const confirmModal = document.getElementById("confirm-modal");
    confirmModal.classList.remove("show");
    confirmModal.classList.add("hidden");
  };

  // Obradi klikove na dugmad za "Approve" i "Reject"
  document.querySelectorAll(".approve-btn, .reject-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const action = button.dataset.action;

      openConfirmModal({
        titleKey: action === "approved" ? "approveTitle" : "rejectTitle",
        messageKey: action === "approved" ? "approveMessage" : "rejectMessage",
        action,
        id,
      });
    });
  });

  // Funkcija za filtriranje zahtjeva
  const filterRequests = () => {
    const searchValue = searchInput.value.toLowerCase();
    const statusValue = filterSelect.value;

    let hasVisibleCards = false;

    cards.forEach((card) => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const email = card.querySelector("p strong").textContent.toLowerCase();
      const status = card.getAttribute("data-status");

      const matchesSearch = name.includes(searchValue) || email.includes(searchValue);
      const matchesStatus = statusValue === "all" || status === statusValue;

      if (matchesSearch && matchesStatus) {
        card.style.display = "block";
        hasVisibleCards = true;
      } else {
        card.style.display = "none";
      }
    });

    if (!hasVisibleCards) {
      if (!document.querySelector(".no-results")) {
        const noResultsMessage = document.createElement("div");
        noResultsMessage.classList.add("no-results");
        noResultsMessage.textContent = "No results found.";
        requestGrid.appendChild(noResultsMessage);
      }
    } else {
      const noResultsMessage = document.querySelector(".no-results");
      if (noResultsMessage) {
        noResultsMessage.remove();
      }
    }
  };

  // Dodaj event listener za pretragu i filter
  searchInput.addEventListener("input", filterRequests);
  filterSelect.addEventListener("change", filterRequests);
});
