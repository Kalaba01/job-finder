document.addEventListener("DOMContentLoaded", () => {
  const searchNameInput = document.getElementById("search-name");
  const positionFilter = document.getElementById("filter-position");
  const statusFilter = document.getElementById("filter-status");
  const applicationsContainer = document.getElementById("applications-container");
  const allApplications = Array.from(document.querySelectorAll(".application-card"));
  const viewButtons = document.querySelectorAll(".view-btn");

  // Localization strings
  const localizations = {
    noResultsMessage: document.body.dataset.noResultsMessage
  };

  // Create and style the "No Tickets" message element
  const noResultsMessage = document.createElement("div");
  noResultsMessage.className = "no-data-container";
  noResultsMessage.innerHTML = `<p class="no-data">${localizations.noResultsMessage}</p>`;
  applicationsContainer.appendChild(noResultsMessage);
  noResultsMessage.style.display = "none";

  // Function to filter applications based on search input and selected filters
  const filterApplications = () => {
    const searchQuery = searchNameInput.value.toLowerCase().trim();
    const selectedPosition = positionFilter.value.trim();
    const selectedStatus = statusFilter.value.trim();

    let visibleCount = 0;

    allApplications.forEach((card) => {
      const candidateName = card
        .querySelector("h2")
        .textContent.toLowerCase()
        .trim();
      const jobTitle = card.getAttribute("data-position").trim();
      const status = card.getAttribute("data-status").trim();

      const matchesSearch = candidateName.includes(searchQuery);
      const matchesPosition = selectedPosition
        ? jobTitle === selectedPosition
        : true;
      const matchesStatus = selectedStatus ? status === selectedStatus : true;

      if (matchesSearch && matchesPosition && matchesStatus) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Show or hide "no results" message based on visible cards
    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  };

   // Add event listeners to "View" button
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const applicationId = button.dataset.id;
      if (applicationId) {
        window.location.href = `applications/${applicationId}`;
      }
    });
  });

  // Add event listeners to filter inputs to trigger filtering
  searchNameInput.addEventListener("input", filterApplications);
  positionFilter.addEventListener("change", filterApplications);
  statusFilter.addEventListener("change", filterApplications);
});
