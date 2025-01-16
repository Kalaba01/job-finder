const { InterviewComment, HiringPhase } = require("../models");

// Add a comment to a candidate's interview process at a specific phase
exports.addComment = async ({ hiringProcessId, phaseId, candidateId, comment }) => {
  return InterviewComment.create({
    hiring_process_id: hiringProcessId,
    phase_id: phaseId,
    candidate_id: candidateId,
    comment: comment
  });
};

// Retrieve the history of comments for a candidate in a specific hiring process
exports.getHistoryByCandidate = async (processId, candidateId) => {
  try {
    const comments = await InterviewComment.findAll({
      where: {
        hiring_process_id: processId,
        candidate_id: candidateId
      },
      include: [
        {
          model: HiringPhase,
          as: "Phase",
          attributes: ["name"]
        }
      ],
      attributes: ["comment", "phase_id"]
    });

    const history = comments.map((comment) => ({
      phaseName: comment.Phase ? comment.Phase.name : "Unknown Phase",
      comment: comment.comment || "No comment"
    }));

    return history;
  } catch (error) {
    console.error("Error fetching candidate history:", error.message || error);
    throw new Error("Failed to fetch candidate history.");
  }
};
