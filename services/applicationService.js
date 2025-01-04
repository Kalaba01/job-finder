const archiver = require('archiver');
const fileService = require("./fileService");
const { PassThrough } = require('stream');
const { Candidate, JobAd, Application, Firm } = require("../models");

exports.getApplicationById = async (applicationId) => {
  const application = await Application.findByPk(applicationId, {
    include: [
      { model: Candidate, attributes: ['first_name', 'last_name', 'about'], as: 'Candidate' },
      { model: JobAd, attributes: ['title', 'description', 'location', 'category', 'custom_questions'], as: 'JobAd' }
    ],
    attributes: ['id', 'submitted_documents', 'answers', 'status', 'createdAt']
  });

  if (!application) throw new Error('Application not found.');

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
    jobTitle: application.JobAd.title,
    jobDescription: application.JobAd.description,
    jobLocation: application.JobAd.location,
    jobCategory: application.JobAd.category,
    date: application.createdAt.toISOString().split("T")[0],
    customQuestions,
    answers,
    submittedDocuments: application.submitted_documents || {}
  };
};

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
        as: "Candidate",
      },
      {
        model: JobAd,
        attributes: ["title", "status", "custom_questions"],
        as: "JobAd",
        include: [
          {
            model: Firm,
            attributes: ["name", "city", "address", "about", "employees", "profile_picture_id"],
            as: "Firm",
          },
        ],
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
    candidateProfilePictureId: application.Candidate.profile_picture_id,
    firmName: application.JobAd.Firm.name,
    firmCity: application.JobAd.Firm.city,
    firmAddress: application.JobAd.Firm.address,
    firmAbout: application.JobAd.Firm.about,
    firmEmployees: application.JobAd.Firm.employees,
    firmProfilePictureId: application.JobAd.Firm.profile_picture_id,
    jobTitle: application.JobAd.title,
    jobStatus: application.JobAd.status,
    submittedDocuments: application.submitted_documents || {},
    answers,
    customQuestions,
    status: application.status,
    date: application.createdAt.toISOString().split("T")[0]
  };
};

exports.createApplicationZip = async (applicationId) => {
  const application = await exports.getApplicationById(applicationId);

  // Generate PDF using fileService
  const pdfBuffer = await fileService.createForFirmPDF({
    candidateName: application.candidateName,
    candidateAbout: application.candidateAbout,
    jobTitle: application.jobTitle,
    jobDescription: application.jobDescription,
    jobLocation: application.jobLocation,
    jobCategory: application.jobCategory,
    date: application.date,
    customQuestions: application.customQuestions,
    answers: application.answers
  });

  // Create ZIP archive
  const archive = archiver('zip', { zlib: { level: 9 } });
  const zipBuffer = [];
  const zipStream = new PassThrough();

  return new Promise((resolve, reject) => {
    // Collect ZIP chunks
    zipStream.on('data', (chunk) => zipBuffer.push(chunk));
    zipStream.on('end', () => resolve(Buffer.concat(zipBuffer)));
    zipStream.on('error', (err) => reject(err));

    // Pipe archive to the PassThrough stream
    archive.pipe(zipStream);

    // Add PDF to ZIP
    archive.append(pdfBuffer, { name: `Report_${application.candidateName}.pdf` });

    // Add submitted documents to ZIP
    (async () => {
      try {
        for (const [docName, fileId] of Object.entries(application.submittedDocuments)) {
          if (fileId) {
            const fileData = await fileService.getFileById(fileId);
            const formattedDocName = `${docName}_${application.candidateName}.pdf`;
            archive.append(fileData.content, { name: formattedDocName });
          }
        }

        // Finalize the ZIP archive
        await archive.finalize();
      } catch (err) {
        archive.emit('error', err);
      }
    })();
  });
};
