const express = require("express");
const router = express.Router();
const firmController = require("../controllers/firmController");
const ticketController = require("../controllers/ticketController");
const jobAdsController = require("../controllers/jobAdsController");
const applicationController = require("../controllers/applicationController");
const hiringProcessController = require("../controllers/hiringProcessController");
const { authMiddleware, languageMiddleware, setMenuOptions, uploadMiddleware, firmApplicationAccessMiddleware, firmHiringProcessAccessMiddleware } = require("../middleware");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isFirm, languageMiddleware, setMenuOptions);

// Firm home
router.get("/", (req, res) => {
  res.render("firm/firm", { locale: req.getLocale() });
});

// Firm dashboard
router.get("/dashboard", firmController.getFirmDashboard);

// Profile routes
router.get("/profile", firmController.showFirmProfile);
router.post("/profile/edit", uploadMiddleware, firmController.updateFirmProfile);

// Tickets routes
router.get("/tickets", ticketController.getTickets);
router.get("/tickets/:ticketId", ticketController.getTicketConversation);

// Job Ads rute
router.get("/job-ads", jobAdsController.showJobAds);
router.post("/job-ads/create", uploadMiddleware, jobAdsController.createJobAd);

router.get("/job-ads/:jobAdId", jobAdsController.getJobAdDetailsForEdit);
router.put("/job-ads/edit/:jobAdId", uploadMiddleware, jobAdsController.editJobAd);
router.put("/job-ads/close/:jobAdId", jobAdsController.closeJobAd);
router.delete("/job-ads/:jobAdId", jobAdsController.deleteJobAd);

// Applications routes
router.get("/applications", applicationController.showFirmApplications);
router.get("/applications/:applicationId", firmApplicationAccessMiddleware, applicationController.showApplicationDetails);
router.get('/applications/:applicationId/zip', applicationController.generateApplicationZip);

// Hiring Process routes
router.get("/hiring-process", hiringProcessController.getFirmHiringProcesses);
router.get("/hiring-process/:processId", firmHiringProcessAccessMiddleware, hiringProcessController.getFirmHiringProcessDetails);
router.get("/hiring-process/:processId/report", hiringProcessController.generateReport);

// Interviews route
router.get("/interviews", firmController.showFirmInterviews);

module.exports = router;
