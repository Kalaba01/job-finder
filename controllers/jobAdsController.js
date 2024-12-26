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

exports.createJobAd = async (req, res) => {
  try {
    const firmId = req.user.id;
    const { title, description, location, category, expiration_date, required_documents, custom_questions } = req.body;

    await jobAdsService.createJobAd({
      firm_id: firmId,
      title,
      description,
      location,
      category,
      expiration_date,
      required_documents: required_documents ? JSON.parse(required_documents) : null,
      custom_questions: custom_questions ? JSON.parse(custom_questions) : null
    });

    res.redirect("/firm/job-ads");
  } catch (error) {
    console.error("Error creating job ad:", error);
    res.status(500).render("error", { message: "Failed to create job ad." });
  }
};
