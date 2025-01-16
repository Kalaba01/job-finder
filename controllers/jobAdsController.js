const jobAdsService = require("../services/jobAdsService");

// Fetches and displays all job ads for the logged-in firm
exports.showJobAds = async (req, res) => {
  try {
    const firmId = req.user.id;
    const { jobAds, statuses } = await jobAdsService.getJobAdsWithStatuses(firmId);

    res.render("firm/firm-job-ads", { jobAds, statuses, locale: req.getLocale() });
  } catch (error) {
    console.error("Error displaying job ads:", error);
    res.status(500).render("shared/error", { message: "Failed to load job ads." });
  }
};

// Fetches job ad details for editing
exports.getJobAdDetailsForEdit = async (req, res) => {
  try {
    const jobAd = await jobAdsService.getJobAdDetailsForEdit(req.params.jobAdId);
    if (!jobAd) return res.status(404).json({ error: "Job ad not found" });
    res.json(jobAd);
  } catch (error) {
    console.error("Error fetching job ad details for edit:", error);
    res.status(500).json({ error: "Failed to fetch job ad details." });
  }
};

// Fetches and displays detailed information about a job ad for a candidate
exports.showJobAdDetails = async (req, res) => {
  try {
    const { jobAd, timeLeft, candidateDocuments } = await jobAdsService.getJobAdDetails(req.params.jobAdId, req.user.id);
    if (!jobAd) return res.status(404).render("shared/error", { message: "Job ad not found." });

    res.render("candidate/job-ad", { locale: req.getLocale(), jobAd, timeLeft, candidateDocuments });
  } catch (error) {
    console.error("Error fetching job ad details:", error);
    res.status(500).render("shared/error", { message: "Failed to load job ad details." });
  }
};

// Fetches all job ads for admin
exports.getAllJobAds = async (req, res) => {
  try {
    const { jobAds, statuses } = await jobAdsService.getAllJobAdsWithDetails();

    res.render("admin/admin-job-ads", { jobAds, statuses });
  } catch (error) {
    console.error("Error fetching job ads for admin:", error);
    res.status(500).render("shared/error", { message: "Failed to load job ads." });
  }
};

// Creates a new job ad for the firm
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
    res.status(500).render("shared/error", { message: "Failed to create job ad." });
  }
};

// Updates an existing job ad for the firm
exports.editJobAd = async (req, res) => {
  try {
    const jobAdId = req.params.jobAdId;
    const firmId = req.user.id;
    const { title, description, location, category, expiration_date, required_documents, custom_questions } = req.body;

    await jobAdsService.editJobAd({
      jobAdId,
      firmId,
      title,
      description,
      location,
      category,
      expiration_date,
      required_documents: required_documents ? JSON.parse(required_documents) : null,
      custom_questions: custom_questions ? JSON.parse(custom_questions) : null
    });

    res.status(200).json({ message: "Job ad updated successfully!" });
  } catch (error) {
    console.error("Error updating job ad:", error);
    res.status(500).render("shared/error", { message: "Failed to update job ad." });
  }
};

// Closes an open job ad
exports.closeJobAd = async (req, res) => {
  try {
    const jobId = req.params.jobAdId;
    await jobAdsService.updateJobAdStatus(jobId, "closed");
    res.status(200).json({ message: "Job ad closed successfully." });
  } catch (error) {
    console.error("Error closing job ad:", error);
    res.status(500).json({ error: "Failed to close job ad." });
  }
};

// Deletes a job ad
exports.deleteJobAd = async (req, res) => {
  try {
    const jobId = req.params.jobAdId;
    await jobAdsService.deleteJobAd(jobId);
    res.status(200).json({ message: "Job ad deleted successfully." });
  } catch (error) {
    console.error("Error deleting job ad:", error);
    res.status(500).json({ error: "Failed to delete job ad." });
  }
};
