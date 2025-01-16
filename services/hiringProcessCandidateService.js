const { HiringProcessCandidate } = require("../models");

// Add a candidate to a specific hiring process
exports.addCandidateToHiringProcess = async (hiringProcessId, candidateId, phaseId) => {
  const result = await HiringProcessCandidate.create({
    hiring_process_id: hiringProcessId,
    candidate_id: candidateId,
    phase_id: phaseId,
    status: "pending"
  });
  if (!result) throw new Error("Failed to add candidate to hiring process.");
  return result;
};
