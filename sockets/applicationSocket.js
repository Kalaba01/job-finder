const { Application, Candidate, JobAd, User, HiringProcess, HiringPhase, HiringProcessCandidate } = require("../models");
const emailService = require("../services/emailService");
const notificationSocket = require("./notificationSocket");

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
                attributes: ["email", "id"]
              },
            ],
          },
          {
            model: JobAd,
            as: "JobAd",
            attributes: ["id", "title"]
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

      if (status === "accepted") {
        const hiringProcess = await HiringProcess.findOne({
          where: { job_ad_id: jobAd.id, active: true }
        });

        if (!hiringProcess) {
          console.error("No active hiring process found for job ad:", jobAd.id);
          socket.emit("error", { message: "No active hiring process found." });
          return;
        }

        const initialPhase = await HiringPhase.findOne({
          where: { id: hiringProcess.current_phase }
        });

        if (!initialPhase) {
          console.error("Initial hiring phase not found for process:", hiringProcess.id);
          socket.emit("error", { message: "Initial phase not found." });
          return;
        }

        await HiringProcessCandidate.create({
          hiring_process_id: hiringProcess.id,
          candidate_id: candidate.user_id,
          phase_id: initialPhase.id,
          status: "pending"
        });

        console.log(`Candidate ${candidate.user_id} added to hiring process ${hiringProcess.id}`);
      }

      io.to(`candidate-${application.candidate_id}`).emit("application-status-updated", {
        applicationId,
        status
      });

      if (user) {
        const message =
        status === "accepted"
          ? `Your application for the job ${jobAd.title} has been accepted.`
          : `Your application for the job ${jobAd.title} has been rejected.`;

        notificationSocket(io, socket).sendNotification(user.id, message, "application-status");
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
