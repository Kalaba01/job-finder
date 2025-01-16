document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");
  const jobAdsList = document.getElementById("job-ads-list-container");
  const noResultsMessage = document.getElementById("no-results-message");

  // Initialize notification system (Notyf)
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  // Localization strings
  const localization = {
    confirmCloseTitle: document.body.dataset.confirmCloseTitle,
    confirmCloseMessage: document.body.dataset.confirmCloseMessage,
    confirmDeleteTitle: document.body.dataset.confirmDeleteTitle,
    confirmDeleteMessage: document.body.dataset.confirmDeleteMessage
  };

  // Function to filter job ads based on search and status filter
  const filterJobAds = () => {
    const searchQuery = searchBar.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();

    let visibleCount = 0;

    // Iterate through each job card in the job ads list
    jobAdsList.childNodes.forEach((jobCard) => {
      if (jobCard.nodeType !== Node.ELEMENT_NODE || jobCard.id === "no-results-message") return;

      const companyElement = jobCard.querySelector(".job-company");
      const statusElement = jobCard.querySelector(".job-status");

      if (!companyElement || !statusElement) return;

      const company = companyElement.textContent.split(":")[1].trim().toLowerCase();
      const status = statusElement.textContent.split(":")[1].trim().toLowerCase();

      const matchesSearch = company.includes(searchQuery);
      const matchesStatus = !selectedStatus || status === selectedStatus;

      if (matchesSearch && matchesStatus) {
        jobCard.style.display = "block";
        visibleCount++;
      } else {
        jobCard.style.display = "none";
      }
    });

    // Show or hide the "no results" message based on the filtering results
    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  };

   // Function to close a job ad
  const updateJobStatus = async (jobId) => {
    try {
      const response = await fetch(`/admin/job-ads/${jobId}/close`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to close job ad.");
      notyf.success("Job ad closed successfully.");
      location.reload();
    } catch (error) {
      console.error(error);
      notyf.error("Error closing job ad.");
    }
  };

  // Function to delete a job ad
  const deleteJobAd = async (jobId) => {
    try {
      const response = await fetch(`/admin/job-ads/${jobId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete job ad.");
      notyf.success("Job ad deleted successfully.");
      location.reload();
    } catch (error) {
      console.error(error);
      notyf.error("Error deleting job ad.");
    }
  };

  // Attach event listeners for real-time filtering
  searchBar.addEventListener("input", filterJobAds);
  statusFilter.addEventListener("change", filterJobAds);

  // Event listener for actions (close/delete) on job ads
  jobAdsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("close-job-btn")) {
      const jobId = event.target.closest(".job-card").dataset.id;
      openConfirmModal({
        title: localization.confirmCloseTitle,
        message: localization.confirmCloseMessage,
        action: "close",
        id: jobId,
        onConfirm: updateJobStatus
      });
    }

    if (event.target.classList.contains("delete-job-btn")) {
      const jobId = event.target.closest(".job-card").dataset.id;
      openConfirmModal({
        title: localization.confirmDeleteTitle,
        message: localization.confirmDeleteMessage,
        action: "delete",
        id: jobId,
        onConfirm: deleteJobAd
      });
    }
  });
});
