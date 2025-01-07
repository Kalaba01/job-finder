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

  if (moveToNextPhaseButton) {
    moveToNextPhaseButton.addEventListener("click", () => {
      socket.emit("move-to-next-phase", { processId });
    });
  }

  socket.on("phase-moved", ({ currentPhase, updatedCandidates }) => {
    const stepperSteps = document.querySelectorAll(".step");
    stepperSteps.forEach((step) => step.classList.remove("active"));
    const activeStep = Array.from(stepperSteps).find(
      (step) => step.querySelector(".step-label").textContent === currentPhase
    );
    if (activeStep) activeStep.classList.add("active");
  
    // Ažuriraj informacije o kandidatima u UI
    updatedCandidates.forEach((candidate) => {
      const candidateCard = document.querySelector(`.candidate-card[data-id="${candidate.candidate_id}"]`);
      if (candidateCard) {
        candidateCard.dataset.status = "pending";
  
        const statusElement = candidateCard.querySelector(".status-text");
        if (statusElement) {
          statusElement.innerHTML = `<strong>Status:</strong> Pending`;
        }
  
        const actionsContainer = candidateCard.querySelector(".actions");
        if (actionsContainer) {
          actionsContainer.innerHTML = `
            <button class="accept-btn" data-id="${candidate.candidate_id}">Accept</button>
            <button class="reject-btn" data-id="${candidate.candidate_id}">Reject</button>
            <a href="/firm/applications/${candidate.candidate_id}" class="application-btn">View Application</a>
            <button class="details-btn" data-id="${candidate.candidate_id}">Details</button>
          `;
  
          // Ponovo dodaj event listenere na Accept i Reject dugmiće
          actionsContainer.querySelector(".accept-btn").addEventListener("click", () => {
            openPopup("accept", candidate.candidate_id);
          });
  
          actionsContainer.querySelector(".reject-btn").addEventListener("click", () => {
            openPopup("reject", candidate.candidate_id);
          });
        }
      }
    });
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

  socket.on("candidate-status-updated", ({ candidateId, action, canMoveToNextPhase }) => {
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
      }
    } else {
      console.error(`Candidate card not found for candidateId: ${candidateId}`);
    }
  
    // Update Move to Next Phase button visibility
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
    } else {
      if (moveToNextPhaseButton) {
        moveToNextPhaseButton.remove();
      }
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
