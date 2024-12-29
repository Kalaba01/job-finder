const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const ticketController = require("../controllers/ticketController");
const jobAdsController = require("../controllers/jobAdsController");
const firmController = require("../controllers/firmController");
const jobAdsService = require("../services/jobAdsService");
const { authMiddleware, languageMiddleware, setMenuOptions, uploadMiddleware } = require("../middleware");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isCandidate, languageMiddleware, setMenuOptions);

router.get("/", async (req, res) => {
  const { jobAds, categories, locations } = await jobAdsService.getAllJobAdsWithDetails();
  res.render("candidate", { locale: req.getLocale(), jobAds, categories, locations });
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

module.exports = router;
