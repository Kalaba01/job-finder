const { InterviewInvite, Firm } = require("../models");

exports.createInvite = async ({ candidateId, jobAdId, hiringProcessId, firmId, scheduledDate, note }) => {
  return InterviewInvite.create({
    candidate_id: candidateId,
    job_ad_id: jobAdId,
    hiring_process_id: hiringProcessId,
    firm_id: firmId,
    scheduled_date: scheduledDate,
    status: "pending",
    note: note
  });
};

exports.getCandidateInterviews = async (candidateId) => {
  return await InterviewInvite.findAll({
    where: { candidate_id: candidateId },
    attributes: ["id", "scheduled_date", "note", "status"],
    include: {
      model: Firm,
      as: "Firm",
      attributes: ["name"]
    },
  });
};

exports.updateInviteStatus = async (inviteId, candidateId, status) => {
  const invite = await InterviewInvite.findOne({
    where: { id: inviteId, candidate_id: candidateId },
  });

  if (!invite) {
    throw new Error("Interview invite not found.");
  }

  invite.status = status;
  await invite.save();

  const updatedInvite = await InterviewInvite.findOne({
    where: { id: inviteId },
    attributes: ["id", "scheduled_date", "note", "status"],
    include: {
      model: Firm,
      as: "Firm",
      attributes: ["name"]
    },
  });

  return updatedInvite;
};
