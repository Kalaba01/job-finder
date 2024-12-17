const candidateService = require("../services/candidateService");

exports.showCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const candidateData = await candidateService.getCandidateProfile(userId);

    res.render("candidate/candidate-profile", { candidate: candidateData, locale: req.getLocale() });
  } catch (error) {
    console.error("Error displaying candidate profile:", error);
    res.status(500).render("error", { message: "Failed to load candidate profile." });
  }
};
