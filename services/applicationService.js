const { Candidate, JobAd, Application, Firm } = require("../models");

exports.applyForJob = async ({ candidateId, jobAdId, answers }) => {
  const jobAd = await JobAd.findByPk(jobAdId);
  const candidate = await Candidate.findByPk(candidateId);

  if (!jobAd) throw new Error("Invalid job ad");
  if (!candidate) throw new Error("Invalid candidate.");

  const requiredDocs = jobAd.required_documents || [];
  const candidateDocs = {
    CV: candidate.cv_file_id,
    "Motivation Letter": candidate.motivation_file_id,
    Recommendations: candidate.recommendations_file_id,
  };

  const missingDocs = requiredDocs.filter((doc) => !candidateDocs[doc]);
  if (missingDocs.length > 0)
    throw new Error(`Missing required documents: ${missingDocs.join(", ")}`);

  const submittedDocuments = {};
  for (const doc of requiredDocs) {
    if (candidateDocs[doc]) submittedDocuments[doc] = candidateDocs[doc];
  }

  const newApplication = await Application.create({
    job_ad_id: jobAdId,
    candidate_id: candidateId,
    submitted_documents: submittedDocuments,
    answers,
    status: "pending",
  });

  return newApplication;
};

exports.getApplicationsForFirm = async (firmId) => {
  const applications = await Application.findAll({
    include: [
      {
        model: Candidate,
        attributes: ["first_name", "last_name"],
        as: "Candidate",
      },
      {
        model: JobAd,
        attributes: ["title"],
        as: "JobAd",
        where: { firm_id: firmId },
      },
    ],
  });

  return applications.map((app) => ({
    id: app.id,
    candidateName: `${app.Candidate.first_name} ${app.Candidate.last_name}`,
    jobTitle: app.JobAd.title,
    status: app.status,
    date: app.createdAt.toISOString().split("T")[0],
  }));
};

exports.getApplicationsForCandidate = async (candidateId) => {
  const applications = await Application.findAll({
    where: { candidate_id: candidateId },
    include: [
      {
        model: JobAd,
        attributes: ["title"],
        as: "JobAd",
        include: [
          {
            model: Firm,
            attributes: ["name"],
            as: "Firm",
          },
        ],
      },
    ],
  });

  return applications.map((app) => ({
    id: app.id,
    jobTitle: app.JobAd.title,
    firmName: app.JobAd.Firm.name,
    status: app.status,
    date: app.createdAt.toISOString().split("T")[0],
  }));
};
