import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  // WebSocket setup
  const socket = io();
  const candidateId = document.body.dataset.userId;

  const searchBar = document.getElementById("search-bar");
  const firmFilter = document.getElementById("firm-filter");
  const statusFilter = document.getElementById("status-filter");
  const applicationsList = document.getElementById("applications-list");
  const noApplicationsMessage = document.getElementById("no-applications-message");
  const noResultsMessage = document.getElementById("no-results-message");

  // Join the candidate's application room to receive real-time updates
  socket.emit("join-application", candidateId);

  // Update application status in real-time when a relevant WebSocket event is received
  socket.on("application-status-updated", ({ applicationId, status }) => {
    const applicationCard = document.querySelector(`.application-card[data-id='${applicationId}']`);
    if (applicationCard) {
      const statusElement = applicationCard.querySelector(".application-status");
      statusElement.textContent = `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
      applicationCard.dataset.status = status.toLowerCase();
    }
  });

  // Handle "View" button click to redirect to the application details page
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

  // Filter applications based on search input, firm, and status filters
  const filterApplications = () => {
    const searchQuery = searchBar.value.toLowerCase();
    const selectedFirm = firmFilter.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();

    let visibleCount = 0;

    // Loop through all application cards and apply the filters
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

  // Attach event listeners to search input and filter dropdowns
  searchBar.addEventListener("input", filterApplications);
  firmFilter.addEventListener("change", filterApplications);
  statusFilter.addEventListener("change", filterApplications);
});
