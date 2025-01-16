import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize WebSocket connection
  const socket = io();

  // Localization strings
  const localization = {
    candidatesTitle: document.body.dataset.candidatesTitle,
    firmsTitle: document.body.dataset.firmsTitle,
    jobAdsTitle: document.body.dataset.jobAdsTitle,
    applicationsTitle: document.body.dataset.applicationsTitle
  };

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch("/admin/dashboard");
      const data = await response.json();
      console.log("Fetched Stats:", data);
      return data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Render a chart on the given canvas context
  const renderChart = (ctx, type, data, labelKey) => {
    if (!ctx) {
      console.error("Canvas context is not available for rendering chart.");
      return null;
    }
    const label = localization[labelKey];
  
    return new Chart(ctx, {
      type,
      data: {
        labels: [label],
        datasets: [
          {
            label: label,
            data: Array.isArray(data) ? data : [0],
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

  // Initial load of stats
  const stats = await fetchData() || {
    candidates: 0,
    firms: 0,
    jobAds: [0],
    applications: 0
  };

  // Render charts
  const candidatesChart = renderChart(
    document.getElementById("candidatesChart"),
    "bar",
    [stats.candidates],
    "candidatesTitle"
  );
  const firmsChart = renderChart(
    document.getElementById("firmsChart"),
    "pie",
    [stats.firms],
    "firmsTitle"
  );
  const jobAdsChart = renderChart(
    document.getElementById("jobAdsChart"),
    "line",
    [stats.jobAds],
    "jobAdsTitle"
  );
  const applicationsChart = renderChart(
    document.getElementById("applicationsChart"),
    "doughnut",
    [stats.applications],
    "applicationsTitle"
  );  

  // Update charts on WebSocket event
  socket.on("update-dashboard", async () => {
    console.log("Update Dashboard Event Received");
    const updatedStats = await fetchData();
  
    console.log("Updated Stats:", updatedStats);
  
    if (!updatedStats) {
      console.error("No stats data available.");
      return;
    }
  
    if (applicationsChart) {
      applicationsChart.data.datasets[0].data = [updatedStats.applications || 0];
      applicationsChart.update();
    }
  });
});
