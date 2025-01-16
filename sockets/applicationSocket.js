const emailService = require("../services/emailService");
const applicationService = require("../services/applicationService")
const hiringPhaseService = require("../services/hiringPhaseService");
const hiringProcessService = require("../services/hiringProcessService");
const hiringProcessCandidateService = require("../services/hiringProcessCandidateService");
const notificationSocket = require("./notificationSocket");

// Handles application-related socket events for the connected user
module.exports = (io, socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

  // Allows the user to join a room specific to their candidate ID
  socket.on("join-application", (candidateId) => {
    if (candidateId) {
      socket.join(`candidate-${candidateId}`);
      console.log(`User ${userId} joined room candidate-${candidateId}`);
    }
  });

  // Sends a notification to the firm when a new application is submitted and emits a dashboard update event
  socket.on("application-submitted", async ({ firmId, jobTitle }) => {
    try {
      const message = `A new application has been submitted for the job ${jobTitle}.`;

      notificationSocket(io, socket).sendNotification(firmId, message, "new-application");
      console.log(`Notification sent to firm ${firmId} about a new application.`);

      io.emit("update-dashboard");
      console.log("Dashboard update event emitted.");
    } catch (error) {
      console.error("Error notifying firm about application submission:", error.message || error);
    }
  });

  // Updates the status of an application and sends relevant notifications and emails
  socket.on("update-application-status", async ({ applicationId, action }) => {
    try {
      if (!["accept", "reject"].includes(action)) {
        socket.emit("error", { message: "Invalid action." });
        return;
      }

      const status = action === "accept" ? "accepted" : "rejected";

      const application = await applicationService.getApplicationById(applicationId);

      if (!application) {
        socket.emit("error", { message: "Application not found." });
        return;
      }

      await applicationService.updateApplicationStatus(applicationId, status);

      const candidate = application.candidate;
      const user = candidate?.user;
      const jobAd = application.jobAd;

      if (status === "accepted") {
        const hiringProcess = await hiringProcessService.findActiveHiringProcess(jobAd.id);

        if (!hiringProcess) {
          console.error("No active hiring process found for job ad:", jobAd.id);
          socket.emit("error", { message: "No active hiring process found." });
          return;
        }

        const initialPhase = await hiringPhaseService.getInitialPhase(hiringProcess.current_phase);

        if (!initialPhase) {
          console.error("Initial hiring phase not found for process:", hiringProcess.id);
          socket.emit("error", { message: "Initial phase not found." });
          return;
        }

        await hiringProcessCandidateService.addCandidateToHiringProcess(
          hiringProcess.id,
          candidate.id,
          initialPhase.id
        );

        console.log(`Candidate ${candidate.user_id} added to hiring process ${hiringProcess.id}`);
      }

      io.to(`candidate-${application.candidate.id}`).emit("application-status-updated", {
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
