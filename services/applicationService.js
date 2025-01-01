const { Candidate, JobAd, Application, Firm, File, Image } = require("../models");

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

exports.getApplicationDetails = async (applicationId) => {
  const application = await Application.findByPk(applicationId, {
    include: [
      {
        model: Candidate,
        attributes: ["first_name", "last_name", "about", "profile_picture_id"],
        as: "Candidate"
      },
      {
        model: JobAd,
        attributes: ["title", "status", "custom_questions"],
        as: "JobAd"
      },
    ],
  });

  if (!application) return null;

  const customQuestions = typeof application.JobAd.custom_questions === "string"
    ? JSON.parse(application.JobAd.custom_questions)
    : application.JobAd.custom_questions || [];

  const answers = typeof application.answers === "string"
    ? JSON.parse(application.answers)
    : application.answers || {};

  return {
    id: application.id,
    candidateName: `${application.Candidate.first_name} ${application.Candidate.last_name}`,
    candidateAbout: application.Candidate.about,
    profilePictureId: application.Candidate.profile_picture_id,
    jobTitle: application.JobAd.title,
    jobStatus: application.JobAd.status,
    submittedDocuments: application.submitted_documents || {},
    answers,
    customQuestions,
    status: application.status,
    date: application.createdAt.toISOString().split("T")[0]
  };
};

exports.updateApplicationStatus = async (applicationId, status) => {
  const application = await Application.findByPk(applicationId);
  if (!application) return null;

  application.status = status;
  await application.save();

  return application;
};
