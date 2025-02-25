const sequelize = require("../config/sequelize");
const fileService = require("./fileService");
const { HiringPhase, HiringProcess, HiringProcessCandidate, JobAd, Candidate, Firm, Application, InterviewComment } = require("../models");

// Fetch a hiring process by its ID with details
exports.findHiringProcessById = async (processId) => {
  const process = await HiringProcess.findOne({
    where: { id: processId },
    include: [
      {
        model: HiringProcessCandidate,
        as: "CandidatesInProcess",
        include: [
          {
            model: Candidate,
            as: "Candidate",
            attributes: ["user_id", "first_name", "last_name"]
          }
        ]
      },
      {
        model: HiringPhase,
        as: "CurrentPhase",
        attributes: ["id", "name"]
      },
      {
        model: JobAd,
        as: "JobAd",
        attributes: ["id", "title"]
      }
    ]
  });

  if (!process) throw new Error(`Hiring process with ID ${processId} not found.`);

  return process;
};

// Find an active hiring process
exports.findActiveHiringProcess = async (jobAdId) => {
  const hiringProcess = await HiringProcess.findOne({ where: { job_ad_id: jobAdId, active: true }});
  if (!hiringProcess) throw new Error("No active hiring process found.");
  return hiringProcess;
};

// Check if there are pending candidates in the specified hiring process
exports.hasPendingCandidates = async (processId) => {
  const pendingCount = await HiringProcessCandidate.count({
    where: { hiring_process_id: processId, status: "pending" }
  });
  return pendingCount > 0;
};

// Move candidates who passed the current phase to the next phase in the hiring process
exports.moveToNextPhase = async (process) => {
  const currentPhase = process.current_phase;

  const nextPhase = await HiringPhase.findOne({ where: { sequence: currentPhase + 1 }});

  if (!nextPhase) throw new Error("No further phases available.");

  const [updatedRows, updatedCandidates] = await HiringProcessCandidate.update(
    { phase_id: nextPhase.id, status: "pending" },
    {
      where: {
        hiring_process_id: process.id,
        phase_id: currentPhase,
        status: "passed"
      },
      returning: true
    }
  );

  if (updatedRows === 0) throw new Error("No candidates to move to the next phase.");

  await process.update({ current_phase: nextPhase.id });

  const candidateDetails = await Promise.all(
    updatedCandidates.map(async (candidate) => {
      const user = await Candidate.findOne({
        where: { user_id: candidate.candidate_id },
        attributes: ["about", "first_name", "last_name"]
      });
  
      const application = await Application.findOne({
        where: { candidate_id: candidate.candidate_id },
        attributes: ["id"]
      });
  
      return {
        candidate_id: candidate.candidate_id,
        name: `${user.first_name} ${user.last_name}`,
        about: user.about || "No information provided.",
        status: candidate.status,
        applicationId: application?.id || null
      };
    })
  );  

  return { nextPhase, updatedCandidates: candidateDetails };
};

// Retrieve all hiring processes for a specific firm
exports.getFirmHiringProcesses = async (firmId) => {
  try {
    const phasesData = await HiringPhase.findAll({
      attributes: ["id", "name"],
      order: [["sequence", "ASC"]]
    });

    const phases = phasesData.map((phase) => ({
      id: phase.id,
      name: phase.name
    }));

    const hiringProcesses = await HiringProcess.findAll({
      include: [
        {
          model: JobAd,
          as: "JobAd",
          where: { firm_id: firmId },
          attributes: ["id", "title", "location", "category", "status"]
        }
      ],
      attributes: ["id", "current_phase"],
      order: [["createdAt", "DESC"]]
    });

    const processes = hiringProcesses.map((process) => {
      const currentPhaseName = phases.find(
        (phase) => phase.id === process.current_phase
      )?.name;

      return {
        id: process.id,
        jobAd: {
          id: process.JobAd.id,
          title: process.JobAd.title,
          location: process.JobAd.location,
          category: process.JobAd.category,
          status: process.JobAd.status
        },
        currentPhase: currentPhaseName || "Unknown Phase"
      };
    });

    const uniqueCategories = [
      ...new Set(
        hiringProcesses.map((process) => process.JobAd.category).filter(Boolean)
      )
    ];

    return {
      processes,
      uniqueCategories,
      phases: phases.map((phase) => phase.name)
    };
  } catch (error) {
    console.error(
      "Error fetching hiring processes for firm:",
      error.message || error
    );
    throw new Error("Failed to fetch hiring processes.");
  }
};

// Retrieve detailed information about a specific hiring process
exports.getHiringProcessDetails = async (processId, candidateId = null) => {
  try {
    console.log("Fetching hiring process with ID:", processId);
    console.log("Candidate ID (if provided):", candidateId);

    const whereCondition = { id: processId };

    const candidateFilter = candidateId
      ? { where: { candidate_id: candidateId }}
      : {};

    const hiringProcess = await HiringProcess.findOne({
      where: whereCondition,
      include: [
        {
          model: HiringPhase,
          as: "CurrentPhase",
          attributes: ["id", "name", "sequence", "is_final"]
        },
        {
          model: JobAd,
          as: "JobAd",
          attributes: ["id", "title", "firm_id"]
        },
        {
          model: HiringProcessCandidate,
          as: "CandidatesInProcess",
          where: sequelize.where(
            sequelize.col("CandidatesInProcess.phase_id"),
            sequelize.col("HiringProcess.current_phase")
          ),
          ...candidateFilter,
          include: [
            {
              model: Candidate,
              as: "Candidate",
              attributes: ["first_name", "last_name", "user_id", "about"],
              include: [
                {
                  model: Application,
                  as: "Applications",
                  attributes: ["id"]
                }
              ]
            }
          ],
          attributes: ["status", "phase_id", "candidate_id"],
        },
        {
          model: InterviewComment,
          as: "Comments",
          attributes: ["comment", "phase_id", "candidate_id"],
          include: [
            {
              model: HiringPhase,
              as: "Phase",
              attributes: ["name"]
            }
          ]
        }
      ]
    });

    if (!hiringProcess) throw new Error("Hiring process not found.");

    const candidates = hiringProcess.CandidatesInProcess.map((entry) => {
      const application = entry.Candidate.Applications?.[0];
    
      const commentsForCandidate = (hiringProcess.Comments || []).filter(
        (comment) => comment.candidate_id === entry.candidate_id
      );
    
      const history = commentsForCandidate.map((comment) => ({
        phaseName: comment.Phase?.name || "Unknown Phase",
        status: entry.status,
        comment: comment.comment || null
      }));
    
      return {
        id: entry.candidate_id,
        name: `${entry.Candidate.first_name} ${entry.Candidate.last_name}`,
        about: entry.Candidate.about || "No information provided.",
        status: entry.status,
        applicationId: application?.id || null,
        history
      };
    });    

    return {
      id: hiringProcess.id,
      active: hiringProcess.active,
      currentPhase: {
        id: hiringProcess.CurrentPhase.id,
        name: hiringProcess.CurrentPhase.name,
        isFinal: hiringProcess.CurrentPhase.is_final
      },
      jobAd: hiringProcess.JobAd,
      candidates
    };
  } catch (error) {
    console.error("Error fetching hiring process details:", error.message || error);
    throw new Error("Failed to fetch hiring process details.");
  }
};

// Retrieve all hiring processes a candidate is participating in
exports.getCandidateHiringProcesses = async (candidateId) => {
  try {
    const phasesData = await HiringPhase.findAll({
      attributes: ["id", "name"],
      order: [["sequence", "ASC"]]
    });

    const phases = phasesData.map((phase) => ({
      id: phase.id,
      name: phase.name
    }));

    const hiringProcesses = await HiringProcess.findAll({
      include: [
        {
          model: HiringProcessCandidate,
          as: "CandidatesInProcess",
          where: { candidate_id: candidateId },
          attributes: ["status", "phase_id"],
          include: [
            {
              model: Candidate,
              as: "Candidate",
              attributes: ["user_id"]
            }
          ],
        },
        {
          model: JobAd,
          as: "JobAd",
          attributes: ["title", "location", "category"],
          include: [
            {
              model: Firm,
              as: "Firm",
              attributes: ["name", "city"]
            }
          ],
        },
        {
          model: HiringPhase,
          as: "CurrentPhase",
          attributes: ["name"]
        }
      ],
      attributes: ["id", "current_phase", "active"],
      order: [["createdAt", "DESC"]]
    });

    const processes = hiringProcesses.map((process) => {
      const candidateProcess = process.CandidatesInProcess[0];
      const currentPhaseName = process.CurrentPhase?.name || "Unknown Phase";

      return {
        id: process.id,
        jobAd: {
          title: process.JobAd?.title || "Unknown Job Ad",
          location: process.JobAd?.location || "Unknown Location",
          category: process.JobAd?.category || "Unknown Category",
          firm: {
            name: process.JobAd?.Firm?.name || "Unknown Firm",
            city: process.JobAd?.Firm?.city || "Unknown City"
          }
        },
        candidateStatus: candidateProcess?.status || "Unknown Status",
        currentPhase: currentPhaseName,
        active: process.active
      };
    });

    const uniqueFirms = [
      ...new Set(hiringProcesses.map((process) => process.JobAd?.Firm?.name).filter(Boolean))
    ];

    return {
      processes,
      phases: phases.map((phase) => phase.name),
      firms: uniqueFirms
    };
  } catch (error) {
    console.error("Error fetching candidate hiring processes:", error.message || error);
    throw new Error("Failed to fetch candidate hiring processes.");
  }
};

// Generate a detailed PDF report for a specific hiring process
exports.generateProcessReport = async (processId) => {
  try {
    const process = await HiringProcess.findOne({
      where: { id: processId },
      include: [
        {
          model: JobAd,
          as: "JobAd",
          attributes: ["title", "description", "location"]
        },
        {
          model: HiringPhase,
          as: "CurrentPhase",
          attributes: ["id", "name", "is_final"]
        },
        {
          model: HiringProcessCandidate,
          as: "CandidatesInProcess",
          include: [
            {
              model: Candidate,
              as: "Candidate",
              attributes: ["first_name", "last_name", "about"]
            },
            {
              model: HiringPhase,
              as: "Phase",
              attributes: ["name"]
            },
          ],
          attributes: ["status", "phase_id", "candidate_id"],
        },
        {
          model: InterviewComment,
          as: "Comments",
          include: [
            {
              model: Candidate,
              as: "Candidate",
              attributes: ["first_name", "last_name"]
            },
            {
              model: HiringPhase,
              as: "Phase",
              attributes: ["name"]
            },
          ],
          attributes: ["comment", "createdAt"]
        }
      ]
    });

    if (!process) throw new Error("Hiring process not found.");

    const candidates = process.CandidatesInProcess.map((entry) => {
      const candidateName = `${entry.Candidate.first_name} ${entry.Candidate.last_name}`;
      const history = (process.Comments || [])
        .filter((comment) => comment.candidate_id === entry.candidate_id)
        .map((comment) => ({
          phaseName: comment.Phase?.name || "Unknown Phase",
          comment: comment.comment,
          date: comment.createdAt
        }));

      return {
        name: candidateName,
        status: entry.status,
        about: entry.Candidate.about || "No details provided",
        history
      };
    });

    const processDuration = { startDate: process.createdAt, endDate: process.updatedAt };

    const data = {
      jobTitle: process.JobAd.title,
      jobDescription: process.JobAd.description,
      jobLocation: process.JobAd.location,
      candidates,
      phases: [
        {
          name: process.CurrentPhase.name,
          isFinal: process.CurrentPhase.is_final
        }
      ],
      processStartDate: processDuration.startDate,
      processEndDate: processDuration.endDate
    };

    return await fileService.createHiringProcessPDF(data);
  } catch (error) {
    console.error("Error generating process report:", error);
    throw new Error("Failed to generate process report.");
  }
};
