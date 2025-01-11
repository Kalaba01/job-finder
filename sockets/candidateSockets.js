const InterviewInviteService = require("../services/interviewInviteService");

const candidateSockets = (io, socket) => {
  const candidateId = socket.request.session.passport.user;

  socket.on("join-interviews", async () => {
    try {
      const interviews = await InterviewInviteService.getCandidateInterviews(
        candidateId
      );
      socket.emit("interviews-updated", interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  });

  socket.on("update-status", async ({ inviteId, status }) => {
    try {
      const updatedInvite = await InterviewInviteService.updateInviteStatus(
        inviteId,
        candidateId,
        status
      );
      socket.emit("status-updated", updatedInvite);
    } catch (error) {
      console.error("Error updating interview status:", error);
    }
  });  
};

module.exports = candidateSockets;
