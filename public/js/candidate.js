document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const categoryFilter = document.getElementById("category-filter");
  const locationFilter = document.getElementById("location-filter");
  const jobAdsList = document.getElementById("job-ads-list-container");
  const noResultsMessage = document.getElementById("no-results-message");
  const viewJobButtons = document.querySelectorAll(".view-job-btn");

  // Add click event listeners to all "View Job" buttons
  viewJobButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const jobAdId = button.getAttribute("data-id");
      if (jobAdId) {
        window.location.href = `/candidate/jobads/${jobAdId}`;
      }
    });
  });

  // Function to filter job ads based on search and selected filters
  const filterJobAds = () => {
    const searchQuery = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();
    const selectedLocation = locationFilter.value.toLowerCase();

    let visibleCount = 0;

    // Loop through all job cards in the job ads list
    Array.from(jobAdsList.children).forEach((jobCard) => {
      if (jobCard.id === "no-results-message") return;

      const title = jobCard
        .querySelector(".job-title")
        .textContent.toLowerCase();
      const category = jobCard
        .querySelector(".job-category")
        .textContent.split(":")[1]
        .trim()
        .toLowerCase();
      const location = jobCard
        .querySelector(".job-location")
        .textContent.split(":")[1]
        .trim()
        .toLowerCase();

      const matchesSearch = title.includes(searchQuery);
      const matchesCategory =
        !selectedCategory || category === selectedCategory;
      const matchesLocation =
        !selectedLocation || location === selectedLocation;

      if (matchesSearch && matchesCategory && matchesLocation) {
        jobCard.style.display = "block";
        visibleCount++;
      } else {
        jobCard.style.display = "none";
      }
    });

    // Display or hide the "No results" message based on visible job count
    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  };

  // Add event listeners for filter changes and search input
  searchBar.addEventListener("input", filterJobAds);
  categoryFilter.addEventListener("change", filterJobAds);
  locationFilter.addEventListener("change", filterJobAds);
});
