const hiringProcessService = require("../services/hiringProcessService");
const interviewInviteService = require("../services/interviewInviteService");
const interviewCommentService = require("../services/interviewCommentService");
const notificationSocket = require("./notificationSocket");
const { HiringProcessCandidate, HiringPhase } = require("../models");

// Handles hiring process-related socket events for the connected user
module.exports = (io, socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

  // Allows the user to join a room for a specific hiring process
  socket.on("join-hiring-process", (processId) => {
    if (processId) {
      socket.join(`process-${processId}`);
      console.log(`User ${userId} joined room process-${processId}`);
    }
  });

  // Automatically joins all rooms for hiring processes associated with the candidate
  socket.on("join-hiring-processes", async () => {
    try {
      const hiringProcesses = await hiringProcessService.getCandidateHiringProcesses(userId);
  
      if (hiringProcesses && hiringProcesses.processes.length > 0) {
        hiringProcesses.processes.forEach((process) => {
          socket.join(`process-${process.id}`);
          console.log(`User ${userId} joined room process-${process.id}`);
        });
      } else {
        console.log(`User ${userId} has no hiring processes to join.`);
      }
    } catch (error) {
      console.error("Error joining hiring processes:", error.message || error);
    }
  });

  // Updates the status of a candidate in a hiring process and creates an interview invite if applicable
  socket.on("update-candidate-status", async ({ processId, candidateId, action, comment, nextInterviewDate, note }) => {
    try {
      if (!["accept", "reject"].includes(action)) {
        socket.emit("error", "Invalid action.");
        return;
      }

      const process = await hiringProcessService.getHiringProcessDetails(processId, candidateId);

      if (!process || !process.candidates || process.candidates.length === 0) {
        socket.emit("error", { message: "Hiring process or candidate not found." });
        return;
      }

      const candidateEntry = process.candidates.find((candidate) => candidate.id === candidateId);

      if (!candidateEntry) {
        socket.emit("error", { message: "Candidate not found in the current process." });
        return;
      }

      const phaseStatus = action === "accept" ? "passed" : "failed";

      const updatedCandidate = await HiringProcessCandidate.update(
        { status: phaseStatus },
        {
          where: {
            hiring_process_id: processId,
            candidate_id: candidateId
          }
        }
      );

      if (!updatedCandidate[0]) throw new Error("Failed to update candidate status.");

      await interviewCommentService.addComment({
        hiringProcessId: process.id,
        phaseId: process.currentPhase.id,
        candidateId: candidateId,
        comment: comment
      });

      const message = action === "accept"
        ? `You have passed the ${process.currentPhase.name} phase for the job ${process.jobAd.title}.`
        : `You have failed the ${process.currentPhase.name} phase for the job ${process.jobAd.title}.`;

      notificationSocket(io, socket).sendNotification(candidateId, message, "hiring-process-status");

      if (action === "accept" && !process.currentPhase.isFinal && nextInterviewDate) {
        await interviewInviteService.createInvite({
            candidateId,
            jobAdId: process.jobAd.id,
            hiringProcessId: process.id,
            firmId: process.jobAd.firm_id,
            scheduledDate: nextInterviewDate,
            note: note || `Scheduled interview for ${nextInterviewDate}`
        });
      }

      const updatedHistory = await interviewCommentService.getHistoryByCandidate(processId, candidateId);
      const pendingCandidates = await hiringProcessService.hasPendingCandidates(processId);

      io.to(`process-${processId}`).emit("candidate-status-updated", {
        candidateId,
        applicationId: candidateEntry.applicationId,
        action,
        comment,
        updatedHistory,
        canMoveToNextPhase: !pendingCandidates,
        currentPhase: process.currentPhase
      });

      const result = await hiringProcessService.getCandidateHiringProcesses(candidateId);

      io.to(`process-${processId}`).emit("hiring-processes-updated", {
        processes: result.processes,
        phases: result.phases,
        firms: result.firms
      });

      console.log(`Candidate ${candidateId} in process ${processId} updated to ${action}`);
    } catch (error) {
      console.error("Error updating candidate status:", error);
      socket.emit("error", { message: "Failed to update candidate status." });
    }
  });

  // Moves the hiring process to the next phase if all candidates have been resolved in the current phase
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
  
      const { nextPhase, updatedCandidates } = await hiringProcessService.moveToNextPhase(process);
  
      const candidatesWithHistory = await Promise.all(
        updatedCandidates.map(async (candidate) => {
          const history = await interviewCommentService.getHistoryByCandidate(processId, candidate.candidate_id);
          return { ...candidate, history };
        })
      );
  
      io.to(`process-${processId}`).emit("phase-moved", {
        currentPhase: nextPhase.name,
        updatedCandidates: candidatesWithHistory,
        message: "Moved to the next phase successfully."
      });
  
      console.log(`Moved to next phase: ${nextPhase.name}`);
    } catch (error) {
      console.error("Error moving to next phase:", error);
      socket.emit("error", "Failed to move to the next phase.");
    }
  });

  // Finalizes the hiring process if it is in the final phase and all candidates are resolved
  socket.on("finalize-process", async ({ processId }) => {
    try {
      const process = await hiringProcessService.findHiringProcessById(processId);
  
      if (!process) {
        socket.emit("error", "Hiring process not found.");
        return;
      }
  
      const currentPhase = await HiringPhase.findOne({ where: { id: process.current_phase } });
  
      if (!currentPhase || !currentPhase.is_final) {
        socket.emit("error", "Cannot finalize a process that is not in the final phase.");
        return;
      }
  
      const pendingCandidates = await hiringProcessService.hasPendingCandidates(processId);
  
      if (pendingCandidates) {
        socket.emit("error", "All candidates must be resolved before finalizing the process.");
        return;
      }
  
      await process.update({ active: false });
  
      io.to(`process-${processId}`).emit("process-finalized");
      console.log(`Process ${processId} finalized.`);
    } catch (error) {
      console.error("Error finalizing process:", error);
      socket.emit("error", "Failed to finalize the process.");
    }
  });  

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId} (Socket ID: ${socket.id})`);
  });
};
