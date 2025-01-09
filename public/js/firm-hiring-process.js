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

  const detailsPopup = document.getElementById("details-popup");
  const detailsContainer = document.getElementById("details-container");
  const closePopupBtn = detailsPopup.querySelector(".close-popup-btn");

  const localizations = {
    noResultsMessage: document.body.dataset.noResultsMessage
  };

  let currentCandidateId = null;
  let currentAction = null;

  const noResultsMessage = document.createElement("p");
  noResultsMessage.id = "no-results-message";
  noResultsMessage.className = "no-data-container";
  noResultsMessage.textContent = localizations.noResultsMessage;
  candidatesContainer.appendChild(noResultsMessage);
  noResultsMessage.style.display = "none";

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
    });
  }

  function createCandidateCard(candidate) {
    const candidateCard = document.createElement("div");
    candidateCard.classList.add("candidate-card");
    candidateCard.dataset.id = candidate.candidate_id;
    candidateCard.dataset.name = candidate.name.toLowerCase();
    candidateCard.dataset.status = candidate.status.toLowerCase();
    candidateCard.dataset.applicationId = candidate.applicationId || "null";
  
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
        <a href="/firm/applications/${candidateCard.dataset.applicationId}" class="application-btn">Application</a>
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
    alert(message);
  });

  const openPopup = (action, candidateId) => {
    currentCandidateId = parseInt(candidateId, 10);
    currentAction = action;

    popupTitle.textContent = action === "accept" 
      ? "Accept Candidate" 
      : "Reject Candidate";

    commentField.querySelector("textarea").value = "";
    dateField.style.display = action === "accept" ? "block" : "none";
    noteField.style.display = action === "accept" ? "block" : "none";

    popup.style.display = "flex";
  };

  const closePopup = () => {
    currentCandidateId = null;
    currentAction = null;
    actionForm.reset();
    popup.style.display = "none";
  };

  const submitAction = (event) => {
    event.preventDefault();

    const comment = commentField.querySelector("textarea").value;
    const nextInterviewDate = currentAction === "accept"
      ? document.getElementById("next-interview-date").value
      : null;
    const note = currentAction === "accept" ? document.getElementById("note").value : null;

    socket.emit("update-candidate-status", {
      processId,
      candidateId: currentCandidateId,
      action: currentAction,
      comment,
      nextInterviewDate,
      note
    });

    closePopup();
  };

  socket.on("candidate-status-updated", ({ candidateId, action, updatedHistory, canMoveToNextPhase }) => {
    const candidateCard = document.querySelector(`.candidate-card[data-id="${candidateId}"]`);

    if (candidateCard) {
        const statusText = action === "accept" ? "Accepted" : "Rejected";
        candidateCard.dataset.status = statusText.toLowerCase();

        const statusElement = candidateCard.querySelector(".status-text");
        if (statusElement) {
            statusElement.innerHTML = `<strong>Status:</strong> ${statusText}`;
        }

        const actionsContainer = candidateCard.querySelector(".actions");
        if (actionsContainer) {
            actionsContainer.innerHTML = `
                <a href="/firm/applications/${candidateId}" class="application-btn">View Application</a>
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

    const moveToNextPhaseButton = document.getElementById("move-to-next-phase");
    if (canMoveToNextPhase) {
        if (!moveToNextPhaseButton) {
            const button = document.createElement("button");
            button.id = "move-to-next-phase";
            button.className = "btn-move-phase";
            button.textContent = "Move To Next Phase";
            button.addEventListener("click", () => {
                socket.emit("move-to-next-phase", { processId });
            });
            document.querySelector(".hiring-process").appendChild(button);
        }
    } else if (moveToNextPhaseButton) {
        moveToNextPhaseButton.remove();
    }
  });

  const filterCandidates = () => {
    const searchQuery = searchBar.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value.toLowerCase().trim();
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

  searchBar.addEventListener("input", filterCandidates);
  statusFilter.addEventListener("change", filterCandidates);

  filterCandidates();
});
