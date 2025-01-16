const candidateService = require("../services/candidateService");
const InterviewInviteService = require("../services/interviewInviteService");

// Displays the candidate's profile page with their data
exports.showCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const candidateData = await candidateService.getCandidateProfile(userId);

    res.render("candidate/candidate-profile", { candidate: candidateData, locale: req.getLocale() });
  } catch (error) {
    console.error("Error displaying candidate profile:", error);
    res.status(500).render("shared/error", { message: "Failed to load candidate profile." });
  }
};

// Updates the candidate's profile with new data and files
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
      profilePicture: files?.profilePicture ? files.profilePicture[0] : null
    });

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Error updating candidate profile:", error);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

// Retrieves the list of interviews for the candidate
exports.getCandidateInterviews = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const interviews = await InterviewInviteService.getCandidateInterviews(candidateId);
    res.render("candidate/candidate-interviews", { interviews, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching candidate interviews:", error);
    res.status(500).send("Error fetching candidate interviews.");
  }
};

// Updates the status of a candidate's interview invitation
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { status } = req.body;
    const candidateId = req.user.id;

    const updatedInvite = await InterviewInviteService.updateInviteStatus(inviteId, candidateId, status);
    res.json(updatedInvite);
  } catch (error) {
    console.error("Error updating interview status:", error);
    res.status(500).send("Error updating interview status.");
  }
};
