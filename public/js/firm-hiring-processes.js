document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const categoryFilter = document.getElementById("category-filter");
  const phaseFilter = document.getElementById("phase-filter");
  const processList = document.querySelector(".process-list");

  const localizations = {
    noAdsMessage: document.body.dataset.noAdsMessage
  };

  const noResultsMessage = document.createElement("p");
  noResultsMessage.id = "no-results-message";
  noResultsMessage.textContent = localizations.noAdsMessage;
  noResultsMessage.style.display = "none";
  noResultsMessage.style.textAlign = "center";
  noResultsMessage.style.marginTop = "20px";
  processList.parentElement.insertBefore(noResultsMessage, processList);

  const filterProcesses = () => {
    const searchInput = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();
    const selectedPhase = phaseFilter.value.toLowerCase();
  
    const processCards = document.querySelectorAll(".process-card");
    let visibleCardCount = 0;
  
    processCards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const category = card.dataset.category ? card.dataset.category.toLowerCase() : "";
      const phase = card.dataset.phase;
  
      const matchesSearch = title.includes(searchInput);
      const matchesCategory = !selectedCategory || category === selectedCategory;
      const matchesPhase = !selectedPhase || phase === selectedPhase;
  
      if (matchesSearch && matchesCategory && matchesPhase) {
        card.style.display = "block";
        visibleCardCount++;
      } else {
        card.style.display = "none";
      }
    });
  
    if (visibleCardCount === 0) {
      noResultsMessage.style.display = "block";
    } else {
      noResultsMessage.style.display = "none";
    }
  };

  searchBar.addEventListener("input", filterProcesses);
  categoryFilter.addEventListener("change", filterProcesses);
  phaseFilter.addEventListener("change", filterProcesses);
});
