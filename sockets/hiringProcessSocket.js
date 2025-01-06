const hiringProcessService = require("../services/hiringProcessService");
const interviewInviteService = require("../services/interviewInviteService");
const interviewCommentService = require("../services/interviewCommentService");

module.exports = (io, socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

  socket.on("join-hiring-process", (processId) => {
    if (processId) {
      socket.join(`process-${processId}`);
      console.log(`User ${userId} joined room process-${processId}`);
    }
  });

  socket.on("update-candidate-status", async ({ processId, candidateId, action, comment, nextInterviewDate, note }) => {
    try {
      if (!["accept", "reject"].includes(action)) {
        socket.emit("error", { message: "Invalid action." });
        return;
      }

      const process = await hiringProcessService.findHiringProcessWithDetails(processId, candidateId);

      if (!process) {
        socket.emit("error", { message: "Hiring process or candidate not found." });
        return;
      }

      // Updating the hiring process status
      const phaseStatus = action === "accept" ? "passed" : "failed";
      await hiringProcessService.updatePhaseStatus(process, phaseStatus);

      // Adding a comment
      await interviewCommentService.addComment({
        hiringProcessId: process.id,
        phaseId: process.current_phase,
        comment: comment
      });

      // If accepted, creating an interview invite
      if (action === "accept" && nextInterviewDate) {
        await interviewInviteService.createInvite({
            candidateId,
            jobAdId: process.job_ad_id,
            hiringProcessId: process.id,
            firmId: process.JobAd?.firm_id,
            scheduledDate: nextInterviewDate,
            note: note || `Scheduled interview for ${nextInterviewDate}`
        });
      }

      // Emiting updated status to all clients in the room
      io.to(`process-${processId}`).emit("candidate-status-updated", {
        candidateId,
        action,
        comment,
        nextInterviewDate,
        note
      });

      console.log(`Candidate ${candidateId} in process ${processId} updated to ${action}`);
    } catch (error) {
      console.error("Error updating candidate status:", error);
      socket.emit("error", { message: "Failed to update candidate status." });
    }
  });

  socket.on("move-to-next-phase", async ({ processId }) => {
    try {
      const process = await hiringProcessService.findHiringProcessById(processId);
  
      if (!process) {
        socket.emit("error", "Hiring process not found.");
        return;
      }
  
      const pendingCandidates = await hiringProcessService.hasPendingCandidates(processId);
  
      if (pendingCandidates) {
        socket.emit("error", "All candidates must be accepted or rejected to move to the next phase.");
        return;
      }
  
      const { nextPhase, updatedProcesses } = await hiringProcessService.moveToNextPhase(process);
  
      // Emitovanje događaja o pomeranju faze i ažuriranim kandidatima
      io.to(`process-${processId}`).emit("phase-moved", {
        currentPhase: nextPhase.name,
        updatedCandidates: updatedProcesses,
        message: "Moved to the next phase successfully."
      });
  
      console.log(`Moved to next phase: ${nextPhase.name}`);
    } catch (error) {
      console.error("Error moving to next phase:", error);
      socket.emit("error", "Failed to move to the next phase.");
    }
  });  

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId} (Socket ID: ${socket.id})`);
  });
};
