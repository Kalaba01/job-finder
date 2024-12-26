const { JobAd } = require("../models");

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
