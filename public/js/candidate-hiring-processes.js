import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize WebSocket connection
  const socket = io();

  const searchBar = document.getElementById("search-bar");
  const phaseFilter = document.getElementById("phase-filter");
  const firmFilter = document.getElementById("firm-filter");
  const processList = document.querySelector(".process-list");

  // Localization strings
  const localizations = {
    noResultsMessage: document.body.dataset.noResultsMessage
  };

  // Create and style a "No Results" message element
  const noResultsMessage = document.createElement("p");
  noResultsMessage.id = "no-results-message";
  noResultsMessage.textContent = localizations.noResultsMessage;
  noResultsMessage.style.display = "none";
  noResultsMessage.style.textAlign = "center";
  noResultsMessage.style.marginTop = "20px";
  processList.parentElement.insertBefore(noResultsMessage, processList);

  // Filter hiring processes based on search query, phase, and firm filters
  const filterProcesses = () => {
    const searchInput = searchBar.value.toLowerCase();
    const selectedPhase = phaseFilter.value.toLowerCase();
    const selectedFirm = firmFilter.value.toLowerCase();

    const processCards = document.querySelectorAll(".process-card");
    let visibleCardCount = 0;

    // Iterate over each process card and apply filters
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

    // Show or hide the "No Results" message based on visible cards
    noResultsMessage.style.display = visibleCardCount === 0 ? "block" : "none";
  };

  // Refresh the process list by rendering new process cards
  const refreshProcesses = (processes) => {
    processList.innerHTML = "";
    processes.forEach((process) => {
      const processCard = document.createElement("div");
      processCard.className = "process-card";
      processCard.dataset.title = process.jobAd.title.toLowerCase();
      processCard.dataset.phase = process.currentPhase.toLowerCase();
      processCard.dataset.firm = process.jobAd.firm.name.toLowerCase();

      processCard.innerHTML = `
        <h2>${process.jobAd.title}</h2>
        <p><strong>Firm:</strong> ${process.jobAd.firm.name}</p>
        <p><strong>City:</strong> ${process.jobAd.firm.city || "Not available"}</p>
        <p><strong>Location:</strong> ${process.jobAd.location || "Not available"}</p>
        <p><strong>Category:</strong> ${process.jobAd.category || "Not available"}</p>
        <p><strong>Current Phase:</strong> ${process.currentPhase}</p>
        <p><strong>Status:</strong> ${process.candidateStatus}</p>
      `;
      processList.appendChild(processCard);
    });
    filterProcesses();
  };

  // Join hiring process rooms for real-time updates
  socket.emit("join-hiring-processes");

  // Listen for updated hiring process data from the server
  socket.on("hiring-processes-updated", (data) => {
    console.log("Updated processes received:", data);
  
    const { processes } = data;
  
    if (Array.isArray(processes)) {
      refreshProcesses(processes);
    } else {
      console.error("Processes is not an array:", processes);
    }
  });  

  // Attach event listeners to filters and search bar
  searchBar.addEventListener("input", filterProcesses);
  phaseFilter.addEventListener("change", filterProcesses);
  firmFilter.addEventListener("change", filterProcesses);
});
