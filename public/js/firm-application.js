document.addEventListener("DOMContentLoaded", () => {
  const acceptBtn = document.getElementById("accept-btn");
  const rejectBtn = document.getElementById("reject-btn");
  const reportBtn = document.getElementById("generate-zip-btn");

  const handleApplicationAction = async (action) => {
    const applicationId = window.location.pathname.split("/").pop();
    try {
      const response = await fetch(`/firm/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        alert(`Application ${action}ed successfully!`);
        location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to ${action} application: ${error.message}`);
      }
    } catch (err) {
      console.error(`Error ${action}ing application:`, err);
      alert(`Failed to ${action} application.`);
    }
  };

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
  
    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => handleApplicationAction("accept"));
    }
  
    if (rejectBtn) {
      rejectBtn.addEventListener("click", () => handleApplicationAction("reject"));
    }
  }
});
