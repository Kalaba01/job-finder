document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const phaseFilter = document.getElementById("phase-filter");
  const firmFilter = document.getElementById("firm-filter");
  const processList = document.querySelector(".process-list");

  const localizations = {
    noResultsMessage: document.body.dataset.noResultsMessage
  };

  const noResultsMessage = document.createElement("p");
  noResultsMessage.id = "no-results-message";
  noResultsMessage.textContent = localizations.noResultsMessage;
  noResultsMessage.style.display = "none";
  noResultsMessage.style.textAlign = "center";
  noResultsMessage.style.marginTop = "20px";
  processList.parentElement.insertBefore(noResultsMessage, processList);

  const filterProcesses = () => {
    const searchInput = searchBar.value.toLowerCase();
    const selectedPhase = phaseFilter.value.toLowerCase();
    const selectedFirm = firmFilter.value.toLowerCase();

    const processCards = document.querySelectorAll(".process-card");
    let visibleCardCount = 0;

    processCards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const phase = card.dataset.phase;
      const firm = card.dataset.firm;

      const matchesSearch = title.includes(searchInput);
      const matchesPhase = !selectedPhase || phase === selectedPhase;
      const matchesFirm = !selectedFirm || firm === selectedFirm;

      if (matchesSearch && matchesPhase && matchesFirm) {
        card.style.display = "block";
        visibleCardCount++;
      } else {
        card.style.display = "none";
      }
    });

    noResultsMessage.style.display = visibleCardCount === 0 ? "block" : "none";
  };

  searchBar.addEventListener("input", filterProcesses);
  phaseFilter.addEventListener("change", filterProcesses);
  firmFilter.addEventListener("change", filterProcesses);
});
