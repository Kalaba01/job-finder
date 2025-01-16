const { HiringProcess, JobAd } = require("../models");

// Restrict access to hiring processes only to the owning firm
const firmHiringProcessAccessMiddleware = async (req, res, next) => {
  try {
    const firmId = req.user.id;
    const processId = req.params.processId;

    if (!processId) return res.status(400).render("400", { message: "Invalid process ID" });

    const hiringProcess = await HiringProcess.findOne({
      where: { id: processId },
      include: {
        model: JobAd,
        as: "AssociatedJobAd",
        attributes: ["firm_id"]
      }
    });

    if (!hiringProcess) return res.status(404).render("shared/404", { message: "Hiring process not found" });
    if (hiringProcess.AssociatedJobAd.firm_id !== firmId) return res.status(403).render("shared/403", { message: "Access denied" });

    next();
  } catch (error) {
    console.error("Error in firmHiringProcessAccessMiddleware:", error);
    return res.status(500).render("firm/firm");
  }
};

module.exports = firmHiringProcessAccessMiddleware;
