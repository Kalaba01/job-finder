import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const processId = parseInt(document.body.dataset.processId, 10);
  socket.emit("join-hiring-process", processId);

  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");
  const candidatesContainer = document.querySelector(".candidates");
  const allCandidates = Array.from(document.querySelectorAll(".candidate-card"));

  const acceptButtons = document.querySelectorAll(".accept-btn");
  const rejectButtons = document.querySelectorAll(".reject-btn");
  const popup = document.getElementById("action-popup");
  const popupTitle = document.getElementById("popup-title");
  const commentField = document.getElementById("comment-field");
  const dateField = document.getElementById("date-field");
  const noteField = document.getElementById("note-field");
  const actionForm = document.getElementById("action-form");
  const closePopupButton = document.getElementById("close-popup");
  const moveToNextPhaseButton = document.getElementById("move-to-next-phase");
  const finalizeProcessButton = document.getElementById("finalize-process");

  const detailsPopup = document.getElementById("details-popup");
  const detailsContainer = document.getElementById("details-container");
  const closePopupBtn = detailsPopup.querySelector(".close-popup-btn");
  const generateReportButton = document.getElementById("generate-report");

  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  const localizations = {
    noResultsMessage: document.body.dataset.noResultsMessage
  };

  let currentCandidateId = null;
  let currentAction = null;

  const noResultsMessage = document.createElement("p");
  noResultsMessage.id = "no-results-message";
  noResultsMessage.className = "no-data-container";
  noResultsMessage.textContent = localizations.noResultsMessage;
  if (candidatesContainer) candidatesContainer.appendChild(noResultsMessage);
  noResultsMessage.style.display = "none";

  if (generateReportButton) {
    generateReportButton.addEventListener("click", async () => {
      try {
        const response = await fetch(`/firm/hiring-process/${processId}/report`);
        if (!response.ok) {
          throw new Error("Failed to generate the report.");
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Hiring_Process_Report_${processId}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
        notyf.success("Report generated successfully!");
      } catch (error) {
        console.error("Error generating report:", error);
        notyf.error("Failed to generate the report.");
      }
    });
  }

  const openDetailsPopup = (candidateId) => {
    const candidateCard = document.querySelector(`.candidate-card[data-id="${candidateId}"]`);
    
    if (!candidateCard) {
      detailsContainer.innerHTML = "<p>No details available for this candidate.</p>";
      return;
    }
  
    const history = JSON.parse(candidateCard.dataset.history || "[]");
  
    detailsContainer.innerHTML = `
      <h4>Selection History:</h4>
      ${
        history.length > 0
          ? `<ul>${history.map(
              (item) =>
                `<li><strong>Phase:</strong> ${item.phaseName}, <strong>Comment:</strong> ${item.comment || "No comment"}</li>`
            ).join("")}</ul>`
          : "<p>No selection history available.</p>"
      }
    `;
  
    detailsPopup.classList.add("visible");
  };  

  const closeDetailsPopup = () => {
    detailsPopup.classList.remove("visible");
    detailsContainer.innerHTML = "";
  };

  closePopupBtn.addEventListener("click", closeDetailsPopup);

  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const candidateId = button.dataset.id;
      openDetailsPopup(candidateId);
    });
  });

  if (moveToNextPhaseButton) {
    moveToNextPhaseButton.addEventListener("click", () => {
      socket.emit("move-to-next-phase", { processId });
      notyf.success("Moved to the next phase.");
    });
  }

  if (finalizeProcessButton) {
    finalizeProcessButton.addEventListener("click", () => {
      socket.emit("finalize-process", { processId });
      notyf.success("Finalizing the process...");
    });
  }

  socket.on("process-finalized", () => {
    notyf.success("The hiring process has been successfully finalized.");
    
    const finalizeButton = document.getElementById("finalize-process");
    if (finalizeButton) finalizeButton.remove();
    
    const moveToNextPhaseButton = document.getElementById("move-to-next-phase");
    if (moveToNextPhaseButton) moveToNextPhaseButton.remove();
    
    const mainContainer = document.querySelector(".hiring-process");
    mainContainer.innerHTML = `
      <div class="process-completed">
        <h2>The selection process is completed!</h2>
        <p>Thank you for using our hiring system.</p>
        <button id="generate-report" class="btn-generate-report">Generate Report</button>
      </div>
    `;
  
    const generateReportButton = document.getElementById("generate-report");
    if (generateReportButton) {
      generateReportButton.addEventListener("click", async () => {
        try {
          const response = await fetch(`/firm/hiring-process/${processId}/report`);
          if (!response.ok) {
            throw new Error("Failed to generate the report.");
          }
  
          const blob = await response.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `Hiring_Process_Report_${processId}.pdf`;
          link.click();
          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error("Error generating report:", error);
          notyf.error("Failed to generate the report.");
        }
      });
    }
  });

  function createCandidateCard(candidate) {
    const candidateCard = document.createElement("div");
    candidateCard.classList.add("candidate-card");
    candidateCard.dataset.id = candidate.candidate_id;
    candidateCard.dataset.name = candidate.name.toLowerCase();
    candidateCard.dataset.status = candidate.status.toLowerCase();
    candidateCard.dataset.applicationId = candidate.applicationId || null;
    console.log("FRONTEND: ", candidate.applicationId);
  
    candidateCard.innerHTML = `
      <h2>${candidate.name}</h2>
      <p><strong>About:</strong> ${candidate.about}</p>
      <p><strong>Status:</strong> ${candidate.status}</p>
      <div class="actions">
        ${
          candidate.status === "pending"
            ? `
            <button class="accept-btn" data-id="${candidate.candidate_id}">Accept</button>
            <button class="reject-btn" data-id="${candidate.candidate_id}">Reject</button>
          `
            : ""
        }
        <a href="/firm/applications/${candidate.applicationId}" class="application-btn">Application</a>
        <button class="details-btn" data-id="${candidate.candidate_id}">Details</button>
      </div>  
    `;
  
    if (candidate.status === "pending") {
      candidateCard.querySelector(".accept-btn").addEventListener("click", () => {
        openPopup("accept", candidate.candidate_id);
      });
  
      candidateCard.querySelector(".reject-btn").addEventListener("click", () => {
        openPopup("reject", candidate.candidate_id);
      });
    }
  
    return candidateCard;
  }

  function updateStepper(currentPhase) {
    const stepperSteps = document.querySelectorAll(".step");
    stepperSteps.forEach((step) => step.classList.remove("active"));
    const activeStep = Array.from(stepperSteps).find(
      (step) => step.querySelector(".step-label").textContent.trim() === currentPhase
    );
    if (activeStep) {
      activeStep.classList.add("active");
    }
  }

  function updateCandidatesList(updatedCandidates) {
    const candidatesContainer = document.querySelector(".candidates");
    candidatesContainer.innerHTML = "";
  
    if (updatedCandidates.length > 0) {
      updatedCandidates.forEach((candidate) => {
        const candidateCard = createCandidateCard(candidate);
        candidateCard.dataset.history = JSON.stringify(candidate.history || []);
  
        candidatesContainer.appendChild(candidateCard);
      });
    } else {
      const noCandidatesMessage = document.createElement("p");
      noCandidatesMessage.textContent = "No candidates in this phase.";
      noCandidatesMessage.className = "no-candidates-message";
      candidatesContainer.appendChild(noCandidatesMessage);
    }
  
    document.querySelectorAll(".details-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const candidateId = button.dataset.id;
        openDetailsPopup(candidateId);
      });
    });
  }  

  function updateMoveToNextPhaseButton(updatedCandidates) {
    const moveToNextPhaseButton = document.getElementById("move-to-next-phase");
    const hasPendingCandidates = updatedCandidates.some((candidate) => candidate.status === "pending");
  
    if (moveToNextPhaseButton && hasPendingCandidates) {
      moveToNextPhaseButton.remove();
    }
  }

  socket.on("phase-moved", ({ currentPhase, updatedCandidates }) => {
    updateStepper(currentPhase);
    updateCandidatesList(updatedCandidates);
    updateMoveToNextPhaseButton(updatedCandidates);
  });

  socket.on("error", (message) => {
    notyf.error(message);
  });

  const openPopup = (action, candidateId) => {
    currentCandidateId = parseInt(candidateId, 10);
    currentAction = action;

    popupTitle.textContent = action === "accept" 
      ? "Accept Candidate" 
      : "Reject Candidate";

    commentField.querySelector("textarea").value = "";

    const isFinalPhase = document.querySelector(".step.active .step-label").textContent.trim() === "Final Interview";

    if (action === "accept" && isFinalPhase) {
        dateField.style.display = "none";
        noteField.style.display = "none";
    } else {
        dateField.style.display = action === "accept" ? "block" : "none";
        noteField.style.display = action === "accept" ? "block" : "none";
    }

    popup.style.display = "flex";
  };

  const closePopup = () => {
    currentCandidateId = null;
    currentAction = null;
    actionForm.reset();
    popup.style.display = "none";
  };

  const submitAction = async (event) => {
    event.preventDefault();

    const comment = commentField.querySelector("textarea").value;
    const nextInterviewDate = currentAction === "accept"
      ? document.getElementById("next-interview-date").value
      : null;
    const note = currentAction === "accept" ? document.getElementById("note").value : null;

    try {
      await socket.emit("update-candidate-status", {
        processId,
        candidateId: currentCandidateId,
        action: currentAction,
        comment,
        nextInterviewDate,
        note
      });

      notyf.success(`Candidate ${currentAction === "accept" ? "accepted" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Error updating candidate status:", error);
      notyf.error("Failed to update candidate status.");
    } finally {
      closePopup();
    }
  };

  socket.on("candidate-status-updated", ({ candidateId, applicationId, action, updatedHistory, canMoveToNextPhase, currentPhase }) => {
    const candidateCard = document.querySelector(`.candidate-card[data-id="${candidateId}"]`);

    if (candidateCard) {
        const statusText = action === "accept" ? "Accepted" : "Rejected";
        candidateCard.dataset.status = statusText.toLowerCase();
        candidateCard.dataset.applicationId = applicationId;

        const statusElement = candidateCard.querySelector(".status-text");
        if (statusElement) {
            statusElement.innerHTML = `<strong>Status:</strong> ${statusText}`;
        }

        const actionsContainer = candidateCard.querySelector(".actions");
        if (actionsContainer) {
            actionsContainer.innerHTML = `
                <a href="/firm/applications/${applicationId}" class="application-btn">Application</a>
                <button class="details-btn" data-id="${candidateId}">Details</button>
            `;

            const detailsButton = actionsContainer.querySelector(".details-btn");
            if (detailsButton) {
                detailsButton.addEventListener("click", () => {
                    openDetailsPopup(candidateId);
                });
            }
        }

        candidateCard.dataset.history = JSON.stringify(updatedHistory);
    }

    const processContainer = document.querySelector(".hiring-process");
    const moveToNextPhaseButton = document.getElementById("move-to-next-phase");
    const finalizeProcessButton = document.getElementById("finalize-process");

    if (moveToNextPhaseButton) moveToNextPhaseButton.remove();
    if (finalizeProcessButton) finalizeProcessButton.remove();

    if (canMoveToNextPhase) {
        if (!currentPhase.isFinal) {
            const nextPhaseButton = document.createElement("button");
            nextPhaseButton.id = "move-to-next-phase";
            nextPhaseButton.className = "btn-move-phase";
            nextPhaseButton.textContent = "Move To Next Phase";
            nextPhaseButton.addEventListener("click", () => {
                socket.emit("move-to-next-phase", { processId });
            });
            processContainer.appendChild(nextPhaseButton);
        } else {
            const finalizeButton = document.createElement("button");
            finalizeButton.id = "finalize-process";
            finalizeButton.className = "btn-finalize-process";
            finalizeButton.textContent = "Finalize Process";
            finalizeButton.addEventListener("click", () => {
                socket.emit("finalize-process", { processId });
            });
            processContainer.appendChild(finalizeButton);
        }
    }
  });

  const filterCandidates = () => {
    const searchQuery = searchBar?.value.toLowerCase().trim();
    const selectedStatus = statusFilter?.value.toLowerCase().trim();
    let visibleCount = 0;
  
    allCandidates.forEach((card) => {
      const candidateName = card.dataset.name || "";
      const candidateStatus = card.dataset.status || "";
  
      const matchesSearch = candidateName.includes(searchQuery);
      const matchesStatus = selectedStatus
        ? candidateStatus === selectedStatus
        : true;
  
      if (matchesSearch && matchesStatus) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });
  
    noResultsMessage.style.display = visibleCount === 0 ? "block" : "none";
  };  

  acceptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openPopup("accept", button.dataset.id);
    });
  });

  rejectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openPopup("reject", button.dataset.id);
    });
  });

  closePopupButton.addEventListener("click", closePopup);
  actionForm.addEventListener("submit", submitAction);

  if (searchBar) searchBar.addEventListener("input", filterCandidates);
  if (statusFilter) statusFilter.addEventListener("change", filterCandidates);

  filterCandidates();
});
