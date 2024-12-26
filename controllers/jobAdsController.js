const jobAdsService = require("../services/jobAdsService");

exports.showJobAds = async (req, res) => {
  try {
    const firmId = req.user.id;
    const { jobAds, statuses } = await jobAdsService.getJobAdsWithStatuses(firmId);

    res.render("firm/job-ads", { jobAds, statuses, locale: req.getLocale() });
  } catch (error) {
    console.error("Error displaying job ads:", error);
    res.status(500).render("error", { message: "Failed to load job ads." });
  }
};
