document.addEventListener("DOMContentLoaded", () => {
  const jobAdsListContainer = document.getElementById("job-ads-list-container");
  const jobAdsList = document.getElementById("job-ads-list");
  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");
  const createJobAdBtn = document.getElementById("create-job-ad-btn");
  const jobAdCreateModal = document.getElementById("job-ad-create-modal");
  const closeCreateModalBtn = document.getElementById("close-create-modal");
  const dropdownButton = document.getElementById("dropdown-button");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const checkboxes = document.querySelectorAll(".document-checkbox");
  const requiredDocumentsJsonInput = document.getElementById("required_documents_json");

  const noAdsMessage = document.createElement("p");
  noAdsMessage.id = "no-ads-message";
  noAdsMessage.className = "no-ads-message";
  noAdsMessage.textContent = "No job ads found.";

  createJobAdBtn.addEventListener("click", () => {
      jobAdCreateModal.style.display = "block";
  });

  closeCreateModalBtn.addEventListener("click", () => {
      jobAdCreateModal.style.display = "none";
  });

  dropdownButton.addEventListener("click", (event) => {
      dropdownMenu.classList.toggle("show");
      event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
      if (!dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
          dropdownMenu.classList.remove("show");
      }
  });

  checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
          const selectedDocuments = Array.from(checkboxes)
              .filter((checkbox) => checkbox.checked)
              .map((checkbox) => checkbox.value);
          requiredDocumentsJsonInput.value = JSON.stringify(selectedDocuments);
      });
  });

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
