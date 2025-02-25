const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const ticketController = require("../controllers/ticketController");
const jobAdsController = require("../controllers/jobAdsController");
const hiringPhaseController = require("../controllers/hiringPhaseController");
const { authMiddleware, languageMiddleware, setMenuOptions } = require("../middleware");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isAdmin, languageMiddleware, setMenuOptions);

// Admin home
router.get("/", (req, res) => {
  res.render("admin/admin", { locale: req.getLocale() });
});

// Admin dashboard
router.get("/dashboard", adminController.getDashboardStats);

// Firm approvals routes
router.get("/company-approvals", adminController.getFirmRequests);
router.post("/company-approvals/update", adminController.updateFirmRequest);

// User Management routes
router.get("/users", adminController.getUsers);
router.post("/users/add", adminController.addUser);
router.get("/users/details/:id", adminController.getUserDetails);
router.put("/users/edit/:id", adminController.editUser);
router.delete("/users/delete/:id", adminController.deleteUser);

// Tickets routes
router.get("/tickets", ticketController.getTickets);
router.get("/tickets/:ticketId", ticketController.getTicketConversation);

// JobAds routes
router.get("/job-ads", jobAdsController.getAllJobAds);
router.put("/job-ads/:jobAdId/close", jobAdsController.closeJobAd);
router.delete("/job-ads/:jobAdId", jobAdsController.deleteJobAd);

// Maintenance route
router.get("/maintenance/", hiringPhaseController.getHiringPhases);
router.post("/maintenance/hiring-phases", hiringPhaseController.createHiringPhase);
router.put("/maintenance/hiring-phases/:id", hiringPhaseController.editHiringPhase);
router.delete("/maintenance/hiring-phases/:id", hiringPhaseController.deleteHiringPhase);

module.exports = router;
