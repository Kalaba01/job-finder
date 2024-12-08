const express = require("express");
const router = express.Router();

// Route for language change
router.get("/set-language/:lang", (req, res) => {
  const lang = req.params.lang;
  if (["en", "bs"].includes(lang)) {
    res.cookie("lang", lang, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid language selected" });
  }
});

module.exports = router;
