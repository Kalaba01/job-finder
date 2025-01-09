const { HiringPhase, HiringProcess, HiringProcessCandidate, JobAd, Candidate, Firm, Application } = require("../models");
const sequelize = require("../config/sequelize");

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

exports.findHiringProcessWithDetails = async (processId, candidateId) => {
  return HiringProcess.findOne({
    where: { id: processId },
    include: [
      {
        model: HiringProcessCandidate,
        as: "CandidatesInProcess",
        where: { candidate_id: candidateId },
        include: [
          {
            model: Candidate,
            as: "Candidate",
            attributes: ["first_name", "last_name", "user_id"]
          },
          {
            model: HiringPhase,
            as: "Phase",
            attributes: ["name", "sequence"]
          }
        ]
      },
      {
        model: HiringPhase,
        as: "CurrentPhase",
        attributes: ["name", "sequence"]
      },
      {
        model: JobAd,
        as: "JobAd",
        attributes: ["id", "title", "firm_id"]
      }
    ]
  });
};

exports.hasPendingCandidates = async (processId) => {
  const pendingCount = await HiringProcessCandidate.count({
    where: { hiring_process_id: processId, status: "pending" }
  });
  return pendingCount > 0;
};

exports.moveToNextPhase = async (process) => {
  const currentPhase = process.current_phase;

  const nextPhase = await HiringPhase.findOne({
    where: { sequence: currentPhase + 1 },
  });

  if (!nextPhase) throw new Error("No further phases available.");

  const [updatedRows, updatedCandidates] = await HiringProcessCandidate.update(
    { phase_id: nextPhase.id, status: "pending" },
    {
      where: {
        hiring_process_id: process.id,
        phase_id: currentPhase,
        status: "passed",
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
      return {
        candidate_id: candidate.candidate_id,
        name: `${user.first_name} ${user.last_name}`,
        about: user.about || "No information provided.",
        status: candidate.status,
        applicationId: candidate.application_id || null,
      };
    })
  );

  return { nextPhase, updatedCandidates: candidateDetails };
};

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

exports.getFirmHiringProcessDetails = async (processId) => {
  try {
    const hiringProcess = await HiringProcess.findOne({
      where: { id: processId },
      include: [
        {
          model: HiringPhase,
          as: "CurrentPhase",
          attributes: ["id", "name", "sequence"]
        },
        {
          model: JobAd,
          as: "JobAd",
          attributes: ["title"]
        },
        {
          model: HiringProcessCandidate,
          as: "CandidatesInProcess",
          where: sequelize.where(
            sequelize.col("CandidatesInProcess.phase_id"),
            sequelize.col("HiringProcess.current_phase")
          ),
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
          attributes: ["status"]
        }
      ]
    });

    if (!hiringProcess) throw new Error("Hiring process not found.");

    const maxAboutLength = 100;

    const candidates = hiringProcess.CandidatesInProcess.map((entry) => ({
      id: entry.Candidate.user_id,
      name: `${entry.Candidate.first_name} ${entry.Candidate.last_name}`,
      about: entry.Candidate.about
        ? `${entry.Candidate.about.slice(0, maxAboutLength)}${entry.Candidate.about.length > maxAboutLength ? "..." : ""}`
        : "No information provided.",
      status: entry.status,
      applicationId: entry.Candidate.Applications?.[0]?.id || null
    }));

    return {
      id: hiringProcess.id,
      currentPhase: hiringProcess.CurrentPhase.name,
      jobAd: hiringProcess.JobAd.title,
      candidates
    };
  } catch (error) {
    console.error("Error fetching hiring process details:", error.message || error);
    throw new Error("Failed to fetch hiring process details.");
  }
};

exports.getCandidateHiringProcesses = async (candidateId) => {
  try {
    const phasesData = await HiringPhase.findAll({
      attributes: ["id", "name"],
      order: [["sequence", "ASC"]],
    });

    const phases = phasesData.map((phase) => ({
      id: phase.id,
      name: phase.name,
    }));

    const hiringProcesses = await HiringProcess.findAll({
      where: { candidate_id: candidateId },
      include: [
        {
          model: JobAd,
          as: "JobAd",
          attributes: ["title", "location", "category"],
          include: [
            {
              model: Firm,
              as: "Firm",
              attributes: ["name", "city"],
            },
          ],
        },
      ],
      attributes: ["id", "current_phase", "phase_status"],
      order: [["createdAt", "DESC"]],
    });

    const processes = hiringProcesses.map((process) => {
      const currentPhaseName = phases.find(
        (phase) => phase.id === process.current_phase
      )?.name;

      return {
        id: process.id,
        jobAd: {
          title: process.JobAd.title,
          location: process.JobAd.location,
          category: process.JobAd.category,
          firm: {
            name: process.JobAd.Firm.name,
            city: process.JobAd.Firm.city,
          },
        },
        currentPhase: currentPhaseName || "Unknown Phase",
        phaseStatus: process.phase_status,
      };
    });

    const uniqueFirms = [
      ...new Set(
        hiringProcesses.map((process) => process.JobAd.Firm.name).filter(Boolean)
      ),
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
