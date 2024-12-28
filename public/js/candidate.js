document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const categoryFilter = document.getElementById("category-filter");
  const locationFilter = document.getElementById("location-filter");
  const jobAdsList = document.getElementById("job-ads-list-container");
  const noResultsMessage = document.getElementById("no-results-message");
  const viewJobButtons = document.querySelectorAll(".view-job-btn");

  viewJobButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const jobAdId = button.getAttribute("data-id");
      if (jobAdId) {
        window.location.href = `/candidate/jobads/${jobAdId}`;
      }
    });
  });

  const filterJobAds = () => {
    const searchQuery = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();
    const selectedLocation = locationFilter.value.toLowerCase();

    let visibleCount = 0;

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

    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  };

  searchBar.addEventListener("input", filterJobAds);
  categoryFilter.addEventListener("change", filterJobAds);
  locationFilter.addEventListener("change", filterJobAds);
});
