document.addEventListener("DOMContentLoaded", () => {
  const generateReportButton = document.getElementById("generate-report-btn");

  if (generateReportButton) {
    generateReportButton.addEventListener("click", async () => {
      const applicationId = window.location.pathname.split("/").pop();
      try {
        const response = await fetch(
          `/candidate/applications/${applicationId}/report`
        );
        if (response.ok) {
          const blob = await response.blob();
          const contentDisposition = response.headers.get(
            "Content-Disposition"
          );
          let fileName = "Application_Report.pdf";

          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            if (match && match[1]) {
              fileName = match[1].replace(/"/g, "");;
            }
          }

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert("Failed to generate report.");
        }
      } catch (error) {
        console.error("Error generating report:", error);
        alert("Error generating report.");
      }
    });
  }
});
