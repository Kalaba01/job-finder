const { HiringPhase, HiringProcess, HiringProcessCandidate, JobAd, Candidate, Firm, Application } = require("../models");

exports.findHiringProcessById = async (processId) => {
  const process = await HiringProcess.findOne({
    where: { id: processId },
    include: [
      {
        model: Candidate,
        as: "Candidate",
        attributes: ["user_id", "first_name", "last_name"]
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
    where: { id: processId, candidate_id: candidateId },
    include: [
      { model: Candidate, as: "Candidate" },
      { model: HiringPhase, as: "CurrentPhase" },
      { model: JobAd, as: "JobAd" }
    ]
  });
};

exports.updatePhaseStatus = async (process, phaseStatus) => {
  return process.update({ phase_status: phaseStatus });
};

exports.hasPendingCandidates = async (processId) => {
  const processes = await HiringProcess.findAll({
    where: { job_ad_id: processId },
    include: [
      {
        model: Candidate,
        as: "Candidate",
        attributes: ["user_id"]
      }
    ]
  });

  return processes.some((process) => process.phase_status === "pending");
};

exports.moveToNextPhase = async (process) => {
  const currentPhase = process.current_phase;

  // Pronađi sledeću fazu
  const nextPhase = await HiringPhase.findOne({
    where: { sequence: currentPhase + 1 }
  });

  if (!nextPhase) throw new Error("No further phases available.");

  // Ažuriraj sve kandidate u trenutnoj fazi koji imaju status 'passed'
  const [updatedRows, updatedProcesses] = await HiringProcess.update(
    { current_phase: nextPhase.id, phase_status: "pending" },
    {
      where: {
        job_ad_id: process.job_ad_id,
        current_phase: currentPhase,
        phase_status: "passed"
      },
      returning: true
    }
  );

  if (updatedRows === 0) {
    throw new Error("No candidates to move to the next phase.");
  }

  return { nextPhase, updatedProcesses };
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
          attributes: ["name", "sequence"]
        },
        {
          model: JobAd,
          as: "JobAd",
          attributes: ["title"],
          include: [
            {
              model: HiringProcess,
              as: "RelatedHiringProcesses",
              attributes: ["phase_status", "candidate_id"],
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
              ]
            }
          ]
        }
      ]
    });

    if (!hiringProcess) throw new Error("Hiring process not found.");

    const maxAboutLength = 100;

    const candidates = hiringProcess.JobAd.RelatedHiringProcesses.map((process) => ({
      id: process.Candidate.user_id,
      name: `${process.Candidate.first_name} ${process.Candidate.last_name}`,
      about: process.Candidate.about
        ? `${process.Candidate.about.slice(0, maxAboutLength)}${process.Candidate.about.length > maxAboutLength ? "..." : ""}`
        : "No information provided.",
      status: process.phase_status,
      applicationId: process.Candidate.Applications?.[0]?.id || null
    }));

    return {
      id: hiringProcess.id,
      currentPhase: hiringProcess.CurrentPhase.name,
      jobAd: hiringProcess.JobAd.title,
      candidates
    };
  } catch (error) {
    console.error("Error fetching hiring process details:", error.message);
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
