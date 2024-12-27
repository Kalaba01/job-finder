document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");
  const jobAdsList = document.getElementById("job-ads-list-container");
  const noResultsMessage = document.getElementById("no-results-message");

  const filterJobAds = () => {
    const searchQuery = searchBar.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();

    let visibleCount = 0;

    jobAdsList.childNodes.forEach((jobCard) => {
      if (
        jobCard.nodeType !== Node.ELEMENT_NODE ||
        jobCard.id === "no-results-message"
      ) {
        return; // Skip non-element nodes or the no-results message
      }

      const titleElement = jobCard.querySelector(".job-title");
      const companyElement = jobCard.querySelector(".job-company");
      const statusElement = jobCard.querySelector(".job-status");

      if (!titleElement || !companyElement || !statusElement) {
        return;
      }

      const title = titleElement.textContent.toLowerCase();
      const company = companyElement.textContent
        .split(":")[1]
        .trim()
        .toLowerCase();
      const status = statusElement.textContent
        .split(":")[1]
        .trim()
        .toLowerCase();

      const matchesSearch =
        title.includes(searchQuery) || company.includes(searchQuery);
      const matchesStatus = !selectedStatus || status === selectedStatus;

      if (matchesSearch && matchesStatus) {
        jobCard.style.display = "block";
        visibleCount++;
      } else {
        jobCard.style.display = "none";
      }
    });

    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  };

  searchBar.addEventListener("input", filterJobAds);
  statusFilter.addEventListener("change", filterJobAds);
});
