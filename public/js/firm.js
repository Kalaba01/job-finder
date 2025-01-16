document.addEventListener("DOMContentLoaded", async () => {
  // Localization strings
  const localization = {
    jobAdsLabel: document.body.dataset.jobAdsLabel,
    applicationsLabel: document.body.dataset.applicationsLabel,
    noDataLabel: document.body.dataset.noDataLabel
  };

  // Fetch firm statistics
  const fetchStats = async () => {
    try {
      const response = await fetch("/firm/dashboard");
      const data = await response.json();
      console.log("Fetched Stats:", data);
      return data;
    } catch (error) {
      console.error("Error fetching firm stats:", error);
      return { jobAds: 0, applications: 0 };
    }
  };

  // Function to render a chart using Chart.js
  const renderChart = (ctx, type, data, label) => {
    return new Chart(ctx, {
      type,
      data: {
        labels: [label],
        datasets: [
          {
            label: label,
            data,
            backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"],
            borderWidth: 1
          }
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  };

  // Fetch firm statistics and wait for the response
  const stats = await fetchStats();

  // Render a bar chart for job ads
  renderChart(
    document.getElementById("jobAdsChart"),
    "bar",
    [stats.jobAds],
    localization.jobAdsLabel
  );

  // Render a pie chart for applications
  renderChart(
    document.getElementById("applicationsChart"),
    "pie",
    [stats.applications],
    localization.applicationsLabel
  );
});
