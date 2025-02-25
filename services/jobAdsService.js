const { Op } = require("sequelize");
const { JobAd, Firm, Candidate, HiringPhase, HiringProcess } = require("../models");

// Fetch all job ads for a specific firm
exports.getJobAdsWithStatuses = async (firmId) => {
  try {
    const jobAds = await JobAd.findAll({
      where: { firm_id: firmId },
      order: [["createdAt", "DESC"]]
    });

    const statuses = ["open", "closed"];

    return { jobAds, statuses };
  } catch (error) {
    console.error("Error fetching job ads for firm:", error);
    throw new Error("Failed to fetch job ads.");
  }
};

// Fetch job ad details for editing
exports.getJobAdDetailsForEdit = async (jobAdId) => {
  try {
    const jobAd = await JobAd.findOne({ where: { id: jobAdId } });
    if (!jobAd) throw new Error("Job ad not found.");
    return jobAd.toJSON();
  } catch (error) {
    console.error("Error fetching job ad for edit:", error);
    throw new Error("Failed to fetch job ad for edit.");
  }
};

// Fetch all job ads with details
exports.getAllJobAdsWithDetails = async (filterActiveOnly = false) => {
  try {
    const whereClause = filterActiveOnly ? { status: "open" } : {};

    const jobAds = await JobAd.findAll({
      where: whereClause,
      include: [
        {
          model: Firm,
          as: "Firm",
          attributes: ["name"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    const statuses = ["open", "closed"];

    const categories = [
      ...new Set(
        jobAds
          .map((jobAd) => jobAd.category)
          .filter((category) => category)
      )
    ];

    const locations = [
      ...new Set(
        jobAds
          .map((jobAd) => jobAd.location)
          .filter((location) => location)
      )
    ];

    return { jobAds, statuses, categories, locations };
  } catch (error) {
    console.error("Error fetching job ads with statuses, categories, and locations:", error);
    throw new Error("Failed to fetch job ads.");
  }
};

// Create a new job ad
exports.createJobAd = async (jobAdData) => {
  try {
    await JobAd.create(jobAdData);
  } catch (error) {
    console.error("Error creating job ad:", error);
    throw new Error("Failed to create job ad.");
  }
};

// Fetch job ad details
exports.getJobAdDetails = async (jobAdId, candidateId) => {
  try {
    const jobAd = await JobAd.findOne({
      where: { id: jobAdId },
      include: [
        {
          model: Firm,
          as: "Firm",
          attributes: ["user_id", "name", "about", "profile_picture_id"]
        }
      ]
    });

    if (!jobAd) throw new Error("Job ad not found.");

    const now = new Date();
    const expirationDate = new Date(jobAd.expiration_date);
    const timeLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));

    const candidate = await Candidate.findOne({
      where: { user_id: candidateId },
      attributes: ["cv_file_id", "motivation_file_id", "recommendations_file_id"]
    });

    const candidateDocuments = {
      "CV": !!candidate?.cv_file_id,
      "Motivation Letter": !!candidate?.motivation_file_id,
      "Recommendations": !!candidate?.recommendations_file_id
    };

    return { jobAd, timeLeft, candidateDocuments };
  } catch (error) {
    console.error("Error fetching job ad details:", error);
    throw new Error("Failed to fetch job ad details.");
  }
};

// Edit an existing job ad
exports.editJobAd = async (jobAdData) => {
  try {
    const { jobAdId, firmId, ...updates } = jobAdData;
    const jobAd = await JobAd.findOne({ where: { id: jobAdId, firm_id: firmId } });

    if (!jobAd) throw new Error("Job ad not found or unauthorized.");
    await jobAd.update(updates);
  } catch (error) {
    console.error("Error updating job ad:", error);
    throw new Error("Failed to update job ad.");
  }
};

// Update the status of a job ad and create a hiring process if the ad is closed
exports.updateJobAdStatus = async (jobId, status) => {
  try {
    await JobAd.update(
      { expiration_date: new Date(), status },
      { where: { id: jobId } }
    );

    if (status === "closed") {
      const initialPhase = await HiringPhase.findOne({
        where: { sequence: 1 }
      });

      if (!initialPhase) throw new Error("Initial phase not found.");

      await HiringProcess.create({
        job_ad_id: jobId,
        current_phase: initialPhase.id,
        active: true
      });
    }
  } catch (error) {
    console.error("Error updating job ad status:", error);
    throw new Error("Failed to update job ad status.");
  }
};

// Delete a job ad
exports.deleteJobAd = async (jobId) => {
  try {
    await JobAd.destroy({ where: { id: jobId } });
  } catch (error) {
    console.error("Error deleting job ad:", error);
    throw new Error("Failed to delete job ad.");
  }
};

// Automatically close expired job ads
exports.closeExpiredJobAds = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const expiredJobAds = await JobAd.findAll({
      where: {
        expiration_date: {
          [Op.between]: [startOfDay, endOfDay]
        },
        status: "open"
      }
    });

    for (const job of expiredJobAds) {
      await this.updateJobAdStatus(job.id, "closed");
      console.log(`JobAd ${job.id} is closed.`);
    }

    return expiredJobAds.length;
  } catch (error) {
    console.error("Error closing ad:", error);
    throw new Error("Unable to close ads.");
  }
};
