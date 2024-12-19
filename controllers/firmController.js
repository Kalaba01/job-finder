const firmService = require("../services/firmService");

exports.showFirmProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const firmData = await firmService.getFirmProfile(userId);

    res.render("firm/firm-profile", { firm: firmData, locale: req.getLocale() });
  } catch (error) {
    console.error("Error displaying firm profile:", error);
    res.status(500).render("error", { message: "Failed to load firm profile." });
  }
};
