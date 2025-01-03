import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const acceptBtn = document.getElementById("accept-btn");
  const rejectBtn = document.getElementById("reject-btn");
  const reportBtn = document.getElementById("generate-zip-btn");

  const localizations = {
    acceptTitle: document.body.dataset.acceptTitle,
    acceptMessage: document.body.dataset.acceptMessage,
    rejectTitle: document.body.dataset.rejectTitle,
    rejectMessage: document.body.dataset.rejectMessage,
  };

  const removeActionButtons = () => {
    const actionsSection = document.querySelector(".actions-section");
    if (actionsSection) {
      actionsSection.innerHTML = "";
    }
  };

  const socket = io();

  const handleApplicationAction = async (applicationId, action) => {
    try {
      socket.emit("update-application-status", { applicationId, action });
      removeActionButtons();
    } catch (error) {
      console.error("Error handling application action:", error);
    }
  };

  socket.on("application-status-updated", ({ applicationId, status }) => {
    console.log(`Application ${applicationId} has been updated to ${status}.`);
  });

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
        } else {
          alert("Failed to generate ZIP file.");
        }
      } catch (error) {
        console.error("Error generating ZIP file:", error);
        alert("Error generating ZIP file.");
      }
    });
  }
});
