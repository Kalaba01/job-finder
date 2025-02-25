const hiringProcessService = require("../services/hiringProcessService");

// Retrieves and renders the list of hiring processes for the logged-in firm
exports.getFirmHiringProcesses = async (req, res) => {
    try {
      const { processes, uniqueCategories, phases } = await hiringProcessService.getFirmHiringProcesses(req.user.id);
  
      res.render("firm/firm-hiring-processes", { hiringProcesses: processes, uniqueCategories, phases });
    } catch (error) {
      console.error("Error fetching firm hiring processes:", error.message || error);
      res.status(500).send("An error occurred while fetching hiring processes.");
    }
};

// Retrieves and renders detailed information about a specific hiring process for the firm
exports.getFirmHiringProcessDetails = async (req, res) => {
  try {
    const { processId } = req.params;
    const processDetails = await hiringProcessService.getHiringProcessDetails(processId);

    res.render("firm/firm-hiring-process", { locale: req.getLocale(), processDetails });
  } catch (error) {
    console.error("Error fetching hiring process details:", error.message);
    res.status(500).send("Failed to fetch hiring process details.");
  }
};

// Retrieves and renders the list of hiring processes associated with the logged-in candidate
exports.getCandidateHiringProcesses = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { processes, phases, firms } = await hiringProcessService.getCandidateHiringProcesses(candidateId);

    res.render("candidate/candidate-hiring-processes", {
      locale: req.getLocale(),
      hiringProcesses: processes,
      phases,
      firms
    });
  } catch (error) {
    console.error("Error showing candidate hiring processes:", error.message || error);
    res.status(500).send("An error occurred while fetching hiring processes.");
  }
};

// Generates a PDF report for a specific hiring process
exports.generateReport = async (req, res) => {
  const { processId } = req.params;

  try {
    const pdfBuffer = await hiringProcessService.generateProcessReport(processId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Hiring_Process_Report_${processId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate the report." });
  }
};
