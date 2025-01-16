const { Application, JobAd } = require("../models");

const firmApplicationAccessMiddleware = async (req, res, next) => {
  try {
    const firmId = req.user.id;
    const applicationId = req.params.applicationId;

    if (!applicationId) return res.status(400).render("400", { message: "Invalid application ID" });

    const application = await Application.findOne({
      where: { id: applicationId },
      include: {
        model: JobAd,
        as: "JobAd",
        attributes: ["firm_id"]
      }
    });

    if (!application) return res.status(404).render("shared/404", { message: "Application not found" });
    if (application.JobAd.firm_id !== firmId) return res.status(403).render("shared/403", { message: "Access denied" });

    next();
  } catch (error) {
    console.error("Error in firmApplicationAccessMiddleware:", error);
    return res.status(500).render("firm/firm");
  }
};

module.exports = firmApplicationAccessMiddleware;
