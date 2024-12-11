const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const adminController = require("../controllers/adminController");
const setAdminMenuOptions = require("../middleware/setAdminMenuOptions");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isAdmin, setAdminMenuOptions);

router.get("/", (req, res) => {
  res.render("admin", { locale: req.getLocale() });
});

// Ruta za prikaz zahteva firmi
router.get("/company-approvals", adminController.getFirmRequests);

// Ruta za ažuriranje statusa zahteva
router.post("/company-approvals/update", adminController.updateFirmRequest);

module.exports = router;
