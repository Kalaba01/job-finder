const applicationService = require("../services/applicationService");

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
    res.status(500).render("error", { message: "Failed to submit application." });
  }
};

exports.showFirmApplications = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsForFirm(req.user.id);
    res.render("firm/firm-applications", { applications, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).render("error", { message: "Failed to load applications." });
  }
};

exports.showCandidateApplications = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsForCandidate(req.user.id);
    const firms = Array.from(new Set(applications.map((app) => app.firmName))).sort();
    res.render("candidate/candidate-applications", { applications, firms, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching applications for candidate:", error);
    res.status(500).render("error", { message: "Failed to load applications." });
  }
};

exports.showApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await applicationService.getApplicationDetails(applicationId);

    if (!application) return res.status(404).render("error", { message: "Application not found." });

    res.render("firm/firm-application", { application, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).render("error", { message: "Failed to load application details." });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { action } = req.body;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action." });
    }

    const status = action === "accept" ? "accepted" : "rejected";
    const result = await applicationService.updateApplicationStatus(applicationId, status);

    if (!result) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: `Application ${action}ed successfully.` });
  } catch (error) {
    console.error(`Error updating application status:`, error);
    res.status(500).json({ message: "Failed to update application status." });
  }
};
