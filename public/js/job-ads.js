document.addEventListener("DOMContentLoaded", () => {
  const jobAdsListContainer = document.getElementById("job-ads-list-container");
  const jobAdsList = document.getElementById("job-ads-list");
  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");

  const noAdsMessage = document.createElement("p");
  noAdsMessage.id = "no-ads-message";
  noAdsMessage.className = "no-ads-message";
  noAdsMessage.textContent = "No job ads found.";

  const filterJobAds = () => {
    const searchQuery = searchBar.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    let visibleCount = 0;

    if (jobAdsList) {
      Array.from(jobAdsList.children).forEach((jobCard) => {
        const title = jobCard.getAttribute("data-title");
        const status = jobCard.getAttribute("data-status");

        const matchesSearch = title.includes(searchQuery);
        const matchesStatus = !selectedStatus || status === selectedStatus;

        const isVisible = matchesSearch && matchesStatus;
        jobCard.style.display = isVisible ? "block" : "none";

        if (isVisible) visibleCount++;
      });
    }

    if (visibleCount === 0) {
      if (!document.getElementById("no-ads-message")) {
        jobAdsListContainer.appendChild(noAdsMessage);
      }
    } else {
      const existingMessage = document.getElementById("no-ads-message");
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  };

  searchBar.addEventListener("input", filterJobAds);
  statusFilter.addEventListener("change", filterJobAds);
});
