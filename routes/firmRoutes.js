const express = require("express");
const router = express.Router();
const firmController = require("../controllers/firmController");
const ticketController = require("../controllers/ticketController");
const jobAdsController = require("../controllers/jobAdsController");
const applicationController = require("../controllers/applicationController");
const hiringProcessController = require("../controllers/hiringProcessController");
const { authMiddleware, languageMiddleware, setMenuOptions, uploadMiddleware } = require("../middleware");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isFirm, languageMiddleware, setMenuOptions);

router.get("/", (req, res) => {
  res.render("firm", { locale: req.getLocale() });
});

// Prikaz profila firme
router.get("/profile", firmController.showFirmProfile);

// Update profila firme
router.post("/profile/edit", uploadMiddleware, firmController.updateFirmProfile);

// Ruta za prikaz ticketa firme
router.get("/tickets", ticketController.getTickets);

// Ruta za prikazivanje konverzacije tiketa
router.get("/tickets/:ticketId", ticketController.getTicketConversation);

// Job Ads rute
router.get("/job-ads", jobAdsController.showJobAds);
router.post("/job-ads/create", uploadMiddleware, jobAdsController.createJobAd);

// Rute za oglase firme
router.get("/job-ads/:jobAdId", jobAdsController.getJobAdDetailsForEdit);
router.put("/job-ads/edit/:jobAdId", uploadMiddleware, jobAdsController.editJobAd);
router.put("/job-ads/close/:jobAdId", jobAdsController.closeJobAd);
router.delete("/job-ads/:jobAdId", jobAdsController.deleteJobAd);

// Prikaz stranice za kandidate i njihove aplikacije
router.get("/applications", applicationController.showFirmApplications);

// Detaljniji prikaz aplikacije
router.get("/applications/:applicationId", applicationController.showApplicationDetails);

// Ruta za generisanje izvjestaja
router.get('/applications/:applicationId/zip', applicationController.generateApplicationZip);

// Ruta za prikaz svih procesa selekcije
router.get("/hiring-process", hiringProcessController.getFirmHiringProcesses);

// Ruta za detaljan prikaz procesa selekcije
router.get("/hiring-process/:processId", hiringProcessController.getFirmHiringProcessDetails);

module.exports = router;
