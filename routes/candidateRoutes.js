const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const ticketController = require("../controllers/ticketController");
const jobAdsController = require("../controllers/jobAdsController");
const firmController = require("../controllers/firmController");
const applicationController = require("../controllers/applicationController");
const hiringProcessController= require("../controllers/hiringProcessController");
const jobAdsService = require("../services/jobAdsService");
const { authMiddleware, languageMiddleware, setMenuOptions, uploadMiddleware } = require("../middleware");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isCandidate, languageMiddleware, setMenuOptions);

router.get("/", async (req, res) => {
  const { jobAds, categories, locations } = await jobAdsService.getAllJobAdsWithDetails(true);
  res.render("candidate/candidate", { locale: req.getLocale(), jobAds, categories, locations });
});

// Ruta za prikaz profila kandidata
router.get("/profile", candidateController.showCandidateProfile);

// Ruta za editovanje profila kandidata
router.put("/profile/edit", uploadMiddleware, candidateController.updateCandidateProfile);

// Ruta za prikaz ticketa kandidata
router.get("/tickets", ticketController.getTickets);

// Ruta za prikazivanje konverzacije tiketa
router.get("/tickets/:ticketId", ticketController.getTicketConversation);

// Ruta za prikaz pojedinačnog oglasa
router.get("/jobads/:jobAdId", jobAdsController.showJobAdDetails);

// Ruta za prikaz detalja firme
router.get("/company/:firmId", firmController.getFirmDetails);

// Ruta za apliciranje na oglas
router.post("/apply", uploadMiddleware, applicationController.submitApplication);

// Ruta za prikaz aplikacija kandidata
router.get("/applications", applicationController.showCandidateApplications);

// Ruta za prikaz detalja aplikacije kandidata
router.get("/applications/:applicationId", applicationController.showCandidateApplicationDetails);

// Ruta za generisanje PDF izveštaja za kandidata
router.get("/applications/:applicationId/report", applicationController.generateCandidatePDF);

// Ruta za prikaz selekcionih procesa kandidata
router.get("/hiring-process", hiringProcessController.getCandidateHiringProcesses);

// Ruta za prikaz intervjua kandidata
router.get("/interviews", candidateController.getCandidateInterviews);

// Ruta za ažuriranje statusa poziva na intervju
router.put("/interviews/:inviteId/status", candidateController.updateInterviewStatus);

module.exports = router;
