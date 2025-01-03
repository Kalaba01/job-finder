document.addEventListener("DOMContentLoaded", () => {
    const generateReportButton = document.getElementById("generate-report-btn");

    if (generateReportButton) {
        generateReportButton.addEventListener("click", () => {
            console.log("clicked");
        });
    }
});
