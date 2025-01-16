import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize WebSocket connection
  const socket = io();

  const acceptBtn = document.getElementById("accept-btn");
  const rejectBtn = document.getElementById("reject-btn");
  const reportBtn = document.getElementById("generate-zip-btn");
  
  // Initialize notification system (Notyf)
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  // Localization strings
  const localizations = {
    acceptTitle: document.body.dataset.acceptTitle,
    acceptMessage: document.body.dataset.acceptMessage,
    rejectTitle: document.body.dataset.rejectTitle,
    rejectMessage: document.body.dataset.rejectMessage
  };

  // Removes the action buttons (accept/reject) from the UI
  const removeActionButtons = () => {
    const actionsSection = document.querySelector(".actions-section");
    if (actionsSection) {
      actionsSection.innerHTML = "";
    }
  };

  // Handles the application status update (accept/reject)
  const handleApplicationAction = async (applicationId, action) => {
    try {
      socket.emit("update-application-status", { applicationId, action });
      removeActionButtons();
      notyf.success(`Application ${action === "accept" ? "accepted" : "rejected"} successfully.`);
    } catch (error) {
      console.error("Error handling application action:", error);
      notyf.error("Failed to update application status.");
    }
  };

  // Listen for application status updates via WebSocket
  socket.on("application-status-updated", ({ applicationId, status }) => {
    notyf.success(`Application has been updated to ${status}.`);
  });

  // Event listener for the "Accept" button
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      window.openConfirmModal({
        title: localizations.acceptTitle,
        message: localizations.acceptMessage,
        action: "accept",
        id: window.location.pathname.split("/").pop(),
        onConfirm: (id, action) => handleApplicationAction(id, action)
      });
    });
  }

  // Event listener for the "Reject" button
  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      window.openConfirmModal({
        title: localizations.rejectTitle,
        message: localizations.rejectMessage,
        action: "reject",
        id: window.location.pathname.split("/").pop(),
        onConfirm: (id, action) => handleApplicationAction(id, action)
      });
    });
  }

  // Event listener for the "Generate ZIP" button
  if (reportBtn) {
    reportBtn.addEventListener("click", async () => {
      const applicationId = window.location.pathname.split("/").pop();
      const candidateName = document.querySelector(".candidate-details p strong").nextSibling.textContent.trim().replace("Name: ", "").replace(" ", "_");
      try {
        const response = await fetch(`/firm/applications/${applicationId}/zip`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${candidateName}_application.zip`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          notyf.success("ZIP file downloaded successfully.");
        } else {
          notyf.error("Failed to generate ZIP file.");
        }
      } catch (error) {
        console.error("Error generating ZIP file:", error);
        notyf.error("Error generating ZIP file.");
      }
    });
  }
});
