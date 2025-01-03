document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const firmFilter = document.getElementById("firm-filter");
  const statusFilter = document.getElementById("status-filter");
  const applicationsList = document.getElementById("applications-list");
  const noApplicationsMessage = document.getElementById("no-applications-message");
  const noResultsMessage = document.getElementById("no-results-message");

  applicationsList.addEventListener("click", (event) => {
    const viewButton = event.target.closest(".view-btn");
    if (viewButton) {
      const applicationCard = viewButton.closest(".application-card");
      const applicationId = applicationCard.dataset.id;
      if (applicationId) {
        window.location.href = `/candidate/applications/${applicationId}`;
      }
    }
  });

  const filterApplications = () => {
    const searchQuery = searchBar.value.toLowerCase();
    const selectedFirm = firmFilter.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();

    let visibleCount = 0;

    Array.from(applicationsList.children).forEach((card) => {
      if (!card.classList.contains("application-card")) return;

      const title = card.dataset.title;
      const firm = card.dataset.firm;
      const status = card.dataset.status;

      const matchesSearch = title.includes(searchQuery);
      const matchesFirm = !selectedFirm || firm === selectedFirm;
      const matchesStatus = !selectedStatus || status === selectedStatus;

      const isVisible = matchesSearch && matchesFirm && matchesStatus;

      card.style.display = isVisible ? "block" : "none";
      if (isVisible) visibleCount++;
    });

    noResultsMessage.style.display =
      visibleCount === 0 && applicationsList.children.length > 0
        ? "block"
        : "none";
    noApplicationsMessage.style.display =
      applicationsList.children.length === 0 ? "block" : "none";
  };

  searchBar.addEventListener("input", filterApplications);
  firmFilter.addEventListener("change", filterApplications);
  statusFilter.addEventListener("change", filterApplications);
});
