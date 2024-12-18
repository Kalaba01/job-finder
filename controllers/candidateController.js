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

exports.updateCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, about } = req.body;
    const files = req.files;

    await candidateService.updateCandidateProfile(userId, {
      first_name,
      last_name,
      about,
      cv: files?.cv ? files.cv[0] : null,
      motivation_letter: files?.motivation_letter ? files.motivation_letter[0] : null,
      recommendations: files?.recommendations ? files.recommendations[0] : null,
    });

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating candidate profile:", error);
    res.status(500).json({ message: "Failed to update profile." });
  }
};
