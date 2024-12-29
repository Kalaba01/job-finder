document.addEventListener("DOMContentLoaded", () => {
  const applyBtn = document.querySelector(".apply-btn");
  const popupOverlay = document.getElementById("applyPopup");
  const closePopupBtn = document.getElementById("closePopup");
  const submitApplicationBtn = document.getElementById("submitApplication");
  const applicationForm = document.getElementById("applicationForm");

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
        alert("Application submitted successfully!");
        applicationForm.reset();
        popupOverlay.classList.remove("active");
      } else {
        const error = await response.text();
        console.error("Error submitting application:", error);
        alert("Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  });
});