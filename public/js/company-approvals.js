document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("status-filter");
  const cards = document.querySelectorAll(".card");

  filterSelect.addEventListener("change", () => {
    const filterValue = filterSelect.value;

    cards.forEach((card) => {
      const status = card.dataset.status;
      if (filterValue === "all" || status === filterValue) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  document.querySelectorAll(".approve-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      await updateRequestStatus(id, "approved");
    });
  });

  document.querySelectorAll(".reject-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      await updateRequestStatus(id, "rejected");
    });
  });

  async function updateRequestStatus(id, status) {
    try {
      const response = await fetch("/admin/company-approvals/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        location.reload();
      } else {
        console.error("Error updating request");
      }
    } catch (error) {
      console.error(error);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const cards = document.querySelectorAll(".card");
  const requestGrid = document.querySelector(".request-grid");

  const filterRequests = () => {
    const searchValue = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;

    let hasVisibleCards = false;

    cards.forEach((card) => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const email = card.querySelector("p strong").textContent.toLowerCase();
      const status = card.getAttribute("data-status");

      const matchesSearch = name.includes(searchValue);
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

  searchInput.addEventListener("input", filterRequests);
  statusFilter.addEventListener("change", filterRequests);
});
