const InterviewInviteService = require("../services/interviewInviteService");
const notificationSocket = require("./notificationSocket");

const interviewSocket = (io, socket) => {
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

      console.log(updatedInvite);


      if (updatedInvite && updatedInvite.firm_id) {
        const message = status === "accepted"
            ? `The candidate has accepted your interview invite scheduled on ${new Date(
                updatedInvite.scheduled_date
              ).toLocaleString()}.`
            : `The candidate has rejected your interview invite scheduled on ${new Date(
                updatedInvite.scheduled_date
              ).toLocaleString()}.`;

        notificationSocket(io, socket).sendNotification(
          updatedInvite.firm_id,
          message,
          "interview-status"
        );

        console.log(
          `Notification sent to firm ${updatedInvite.firm_id}: ${message}`
        );
      }

    } catch (error) {
      console.error("Error updating interview status:", error);
    }
  });  
};

module.exports = interviewSocket;
