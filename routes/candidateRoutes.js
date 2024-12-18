const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const { authMiddleware, languageMiddleware, setMenuOptions, uploadMiddleware } = require("../middleware");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isCandidate, languageMiddleware, setMenuOptions);

router.get("/", (req, res) => {
  res.render("candidate", { locale: req.getLocale() });
});

// Ruta za prikaz profila kandidata
router.get("/profile", candidateController.showCandidateProfile);

// Ruta za editovanje profila kandidata
router.put("/profile/edit", uploadMiddleware, candidateController.updateCandidateProfile);

module.exports = router;
