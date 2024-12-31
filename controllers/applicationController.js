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

exports.showApplications = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsForFirm(req.user.id);
    res.render("firm/firm-application", { applications, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).render("error", { message: "Failed to load applications." });
  }
};
