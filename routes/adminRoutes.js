const express = require("express");
const router = express.Router();
const { authMiddleware, languageMiddleware, setMenuOptions } = require("../middleware");
const adminController = require("../controllers/adminController");

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
router.put("/users/edit/:id", adminController.editUser);
router.delete("/users/delete/:id", adminController.deleteUser);

module.exports = router;
