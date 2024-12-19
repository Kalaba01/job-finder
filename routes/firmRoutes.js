const express = require("express");
const router = express.Router();
const firmController = require("../controllers/firmController");
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

module.exports = router;
