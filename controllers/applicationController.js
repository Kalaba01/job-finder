const applicationService = require("../services/applicationService");
const fileService = require("../services/fileService");

// Handles job application submission by a candidate
exports.submitApplication = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { jobAdId, answers } = req.body;

    await applicationService.applyForJob({
      candidateId,
      jobAdId,
      answers
    });

    res.redirect(`/candidate/jobads/${jobAdId}`);
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).render("shared/error", { message: "Failed to submit application." });
  }
};

// Renders the list of applications for a specific firm
exports.showFirmApplications = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsForFirm(req.user.id);
    res.render("firm/firm-applications", { applications, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).render("shared/error", { message: "Failed to load applications." });
  }
};

// Renders the list of applications submitted by a specific candidate
exports.showCandidateApplications = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsForCandidate(req.user.id);
    const firms = Array.from(new Set(applications.map((app) => app.firmName))).sort();
    res.render("candidate/candidate-applications", { applications, firms, user: req.user, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching applications for candidate:", error);
    res.status(500).render("shared/error", { message: "Failed to load applications." });
  }
};

// Renders detailed information about a specific application for a candidate
exports.showCandidateApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await applicationService.getApplicationDetails(applicationId);

    if (!application) return res.status(404).render("shared/error", { message: "Application not found." });

    res.render("candidate/candidate-application", { application, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).render("shared/error", { message: "Failed to load application details." });
  }
};

// Renders detailed information about a specific application for a firm
exports.showApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await applicationService.getApplicationDetails(applicationId);

    if (!application) return res.status(404).render("shared/error", { message: "Application not found." });

    res.render("firm/firm-application", { application, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).render("shared/error", { message: "Failed to load application details." });
  }
};

// Generates a ZIP file containing all relevant documents for a specific application
exports.generateApplicationZip = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await applicationService.getApplicationById(applicationId);
    const zipFileName = `${application.candidateName}_application.zip`;
    const zipBuffer = await applicationService.createApplicationZip(applicationId);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
    res.send(zipBuffer);
  } catch (error) {
    console.error('Error generating ZIP:', error);
    res.status(500).json({ message: 'Failed to generate ZIP file.' });
  }
};

// Generates a PDF file containing detailed information about a specific application
exports.generateCandidatePDF = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await applicationService.getApplicationDetails(applicationId);

    if (!application) return res.status(404).json({ message: "Application not found." });

    const pdfBuffer = await fileService.createForCandidatePDF(application);

    // Sanitizacija imena fajla
    const sanitizedFirmName = application.firmName.replace(/[^a-zA-Z0-9]/g, "_");
    const sanitizedJobTitle = application.jobTitle.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${sanitizedFirmName}_${sanitizedJobTitle}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating candidate PDF:", error);
    res.status(500).json({ message: "Failed to generate candidate PDF." });
  }
};
