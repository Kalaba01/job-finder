const { InterviewInvite } = require("../models");

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
