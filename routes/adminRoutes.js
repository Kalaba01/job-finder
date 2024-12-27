const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const ticketController = require("../controllers/ticketController");
const jobAdsController = require("../controllers/jobAdsController");
const { authMiddleware, languageMiddleware, setMenuOptions } = require("../middleware");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isAdmin, languageMiddleware, setMenuOptions);

router.get("/", (req, res) => {
  res.render("admin", { locale: req.getLocale() });
});

// Ruta za prikaz zahteva firmi
router.get("/company-approvals", adminController.getFirmRequests);

// Ruta za ažuriranje statusa zahteva
router.post("/company-approvals/update", adminController.updateFirmRequest);

// User Management rute
router.get("/users", adminController.getUsers);
router.post("/users/add", adminController.addUser);
router.get("/users/details/:id", adminController.getUserDetails);
router.put("/users/edit/:id", adminController.editUser);
router.delete("/users/delete/:id", adminController.deleteUser);

// Prikaz svih tiketa
router.get("/tickets", ticketController.getTickets);

// Ruta za prikazivanje konverzacije tiketa
router.get("/tickets/:ticketId", ticketController.getTicketConversation);

router.get("/job-ads", jobAdsController.getAllJobAds);


module.exports = router;
