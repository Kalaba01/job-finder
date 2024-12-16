const express = require("express");
const router = express.Router();
const { authMiddleware, languageMiddleware, setMenuOptions } = require("../middleware");

// Middleware za postavljanje menuOptions
router.use(authMiddleware.isAuthenticated, authMiddleware.isFirm, languageMiddleware, setMenuOptions);

router.get("/", (req, res) => {
  res.render("firm", { locale: req.getLocale() });
});

module.exports = router;
