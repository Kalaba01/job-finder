const { Application, Candidate, JobAd, User } = require("../models");
const emailService = require("../services/emailService");

module.exports = (io, socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

  socket.on("join-application", (candidateId) => {
    if (candidateId) {
      socket.join(`candidate-${candidateId}`);
      console.log(`User ${userId} joined room candidate-${candidateId}`);
    }
  });

  socket.on("update-application-status", async ({ applicationId, action }) => {
    try {
      if (!["accept", "reject"].includes(action)) {
        socket.emit("error", { message: "Invalid action." });
        return;
      }

      const status = action === "accept" ? "accepted" : "rejected";

      const application = await Application.findByPk(applicationId, {
        include: [
          {
            model: Candidate,
            as: "Candidate",
            include: [
              {
                model: User,
                as: "CandidateUser",
                attributes: ["email"]
              },
            ],
          },
          {
            model: JobAd,
            as: "JobAd",
            attributes: ["title"]
          },
        ],
      });

      if (!application) {
        socket.emit("error", { message: "Application not found." });
        return;
      }

      application.status = status;
      await application.save();

      const candidate = application.Candidate;
      const user = candidate?.CandidateUser;
      const jobAd = application.JobAd;

      io.to(`candidate-${application.candidate_id}`).emit("application-status-updated", {
        applicationId,
        status
      });

      if (user) {
        if (status === "accepted") {
          await emailService.sendCandidateAcceptedEmail(
            user.email,
            candidate.first_name,
            jobAd.title
          );
        } else if (status === "rejected") {
          await emailService.sendCandidateRejectedEmail(
            user.email,
            candidate.first_name,
            jobAd.title
          );
        }
      }

      console.log(`Application ${applicationId} updated to ${status}`);
    } catch (error) {
      console.error("Error updating application status:", error);
      socket.emit("error", { message: "Failed to update application status." });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId} (Socket ID: ${socket.id})`);
  });
};
