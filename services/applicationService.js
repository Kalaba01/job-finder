const { Candidate, JobAd, Application } = require("../models");

exports.applyForJob = async ({ candidateId, jobAdId, answers }) => {
  const jobAd = await JobAd.findByPk(jobAdId);
  const candidate = await Candidate.findByPk(candidateId);

  if (!jobAd) throw new Error("Invalid job ad");
  if (!candidate) throw new Error("Invalid candidate.");

  const requiredDocs = jobAd.required_documents || [];
  const candidateDocs = {
    CV: candidate.cv_file_id,
    "Motivation Letter": candidate.motivation_file_id,
    Recommendations: candidate.recommendations_file_id
  };

  const missingDocs = requiredDocs.filter((doc) => !candidateDocs[doc]);
  if (missingDocs.length > 0) throw new Error(`Missing required documents: ${missingDocs.join(", ")}`);

  const submittedDocuments = {};
  for (const doc of requiredDocs) {
    if (candidateDocs[doc]) submittedDocuments[doc] = candidateDocs[doc];
  }

  const newApplication = await Application.create({
    job_ad_id: jobAdId,
    candidate_id: candidateId,
    submitted_documents: submittedDocuments,
    answers,
    status: "pending"
  });

  return newApplication;
};
