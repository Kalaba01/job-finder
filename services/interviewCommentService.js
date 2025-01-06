const { InterviewComment } = require("../models");

exports.addComment = async ({ hiringProcessId, phaseId, comment }) => {
  return InterviewComment.create({
    hiring_process_id: hiringProcessId,
    phase_id: phaseId,
    comment: comment
  });
};
