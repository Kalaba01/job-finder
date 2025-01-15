import { io } from "/socket.io-client/socket.io.esm.min.js";

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top"
    }
  });

  const applyBtn = document.querySelector(".apply-btn");
  const popupOverlay = document.getElementById("applyPopup");
  const closePopupBtn = document.getElementById("closePopup");
  const submitApplicationBtn = document.getElementById("submitApplication");
  const applicationForm = document.getElementById("applicationForm");

  const firmId = document.body.dataset.firmId;
  const jobTitle = document.body.dataset.jobTitle;

  applyBtn.addEventListener("click", () => {
    popupOverlay.classList.add("active");
  });

  closePopupBtn.addEventListener("click", () => {
    popupOverlay.classList.remove("active");
  });

  window.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.classList.remove("active");
    }
  });

  if (submitApplicationBtn) {
    submitApplicationBtn.addEventListener("click", async () => {
      const rawFormData = new FormData(applicationForm);
      const cleanedFormData = new FormData();

      const answers = {};

      for (const [key, value] of rawFormData.entries()) {
        if (key.startsWith("answers[")) {
          const match = key.match(/answers\[(\d+)\](\[\])?/);
          if (match) {
            const questionId = match[1];
            if (match[2]) {
              if (!answers[questionId]) {
                answers[questionId] = [];
              }
              answers[questionId].push(value);
            } else {
              answers[questionId] = value;
            }
          }
        } else {
          cleanedFormData.append(key, value);
        }
      }

      cleanedFormData.append("answers", JSON.stringify(answers));

      try {
        const response = await fetch("/candidate/apply", {
          method: "POST",
          body: cleanedFormData,
        });

        if (response.ok) {
          notyf.success("Application submitted successfully!");
          applicationForm.reset();
          popupOverlay.classList.remove("active");

          socket.emit("application-submitted", { firmId, jobTitle });
        } else {
          const error = await response.text();
          console.error("Error submitting application:", error);
          notyf.error("Failed to submit application.");
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        notyf.error("Failed to submit application.");
      }
    });
  }
});
