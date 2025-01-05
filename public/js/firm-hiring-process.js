document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");
  const candidatesContainer = document.querySelector(".candidates");
  const allCandidates = Array.from(document.querySelectorAll(".candidate-card"));

  const localizations = {
    noResultsMessage: document.body.dataset.noResultsMessage
  };

  const noResultsMessage = document.createElement("p");
  noResultsMessage.id = "no-results-message";
  noResultsMessage.className = "no-data-container";
  noResultsMessage.textContent = localizations.noResultsMessage;
  candidatesContainer.appendChild(noResultsMessage);
  noResultsMessage.style.display = "none";

  const filterCandidates = () => {
    const searchQuery = searchBar.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value.toLowerCase().trim();
    let visibleCount = 0;

    allCandidates.forEach((card) => {
      const candidateName = card.dataset.name || "";
      const candidateStatus = card.dataset.status || "";

      const matchesSearch = candidateName.includes(searchQuery);
      const matchesStatus = selectedStatus
        ? candidateStatus === selectedStatus
        : true;

      if (matchesSearch && matchesStatus) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  };

  searchBar.addEventListener("input", filterCandidates);
  statusFilter.addEventListener("change", filterCandidates);

  filterCandidates();
});
