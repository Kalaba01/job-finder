const { JobAd, Firm } = require("../models");

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

exports.getAllJobAdsWithDetails = async () => {
  try {
    const jobAds = await JobAd.findAll({
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

exports.createJobAd = async (jobAdData) => {
  try {
    await JobAd.create(jobAdData);
  } catch (error) {
    console.error("Error creating job ad:", error);
    throw new Error("Failed to create job ad.");
  }
};

exports.getJobAdDetails = async (jobAdId) => {
  try {
    const jobAd = await JobAd.findOne({
      where: { id: jobAdId },
      include: [
        {
          model: Firm,
          as: "Firm",
          attributes: ["name", "about", "profile_picture_id"]
        }
      ]
    });

    if (!jobAd) throw new Error("Job ad not found.");

    const now = new Date();
    const expirationDate = new Date(jobAd.expiration_date);
    const timeLeft = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));

    return { jobAd, timeLeft };
  } catch (error) {
    console.error("Error fetching job ad details:", error);
    throw new Error("Failed to fetch job ad details.");
  }
};
