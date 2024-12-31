document.addEventListener("DOMContentLoaded", () => {
  const searchNameInput = document.getElementById("search-name");
  const positionFilter = document.getElementById("filter-position");
  const statusFilter = document.getElementById("filter-status");
  const applicationsContainer = document.getElementById("applications-container");
  const allApplications = Array.from(document.querySelectorAll(".application-card"));

  const noResultsMessage = document.createElement("div");
  noResultsMessage.className = "no-data-container";
  noResultsMessage.innerHTML = `<p class="no-data">No applications match the criteria.</p>`;
  applicationsContainer.appendChild(noResultsMessage);
  noResultsMessage.style.display = "none";

  const filterApplications = () => {
    const searchQuery = searchNameInput.value.toLowerCase();
    const selectedPosition = positionFilter.value;
    const selectedStatus = statusFilter.value;

    let visibleCount = 0;

    allApplications.forEach((card) => {
      const candidateName = card.querySelector("h2").textContent.toLowerCase();
      const jobTitle = card
        .querySelector("p:nth-of-type(1)")
        .textContent.replace("Position: ", "");
      const status = card
        .querySelector("p:nth-of-type(2)")
        .textContent.replace("Status: ", "");

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

    if (visibleCount === 0) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }
  };

  searchNameInput.addEventListener("input", filterApplications);
  positionFilter.addEventListener("change", filterApplications);
  statusFilter.addEventListener("change", filterApplications);
});
