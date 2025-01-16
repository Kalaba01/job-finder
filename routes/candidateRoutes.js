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

// Candidate home
router.get("/", async (req, res) => {
  const { jobAds, categories, locations } = await jobAdsService.getAllJobAdsWithDetails(true);
  res.render("candidate/candidate", { locale: req.getLocale(), jobAds, categories, locations });
});

// Profile routes
router.get("/profile", candidateController.showCandidateProfile);
router.put("/profile/edit", uploadMiddleware, candidateController.updateCandidateProfile);

// Tickets routes
router.get("/tickets", ticketController.getTickets);
router.get("/tickets/:ticketId", ticketController.getTicketConversation);

// JobAd route
router.get("/jobads/:jobAdId", jobAdsController.showJobAdDetails);

// Firm details route
router.get("/company/:firmId", firmController.getFirmDetails);

// JobAd applying route
router.post("/apply", uploadMiddleware, applicationController.submitApplication);

// Application routes
router.get("/applications", applicationController.showCandidateApplications);
router.get("/applications/:applicationId", applicationController.showCandidateApplicationDetails);
router.get("/applications/:applicationId/report", applicationController.generateCandidatePDF);

// Hiring Process route
router.get("/hiring-process", hiringProcessController.getCandidateHiringProcesses);

// Interview route
router.get("/interviews", candidateController.getCandidateInterviews);
router.put("/interviews/:inviteId/status", candidateController.updateInterviewStatus);

module.exports = router;
