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

exports.updateFirmProfile = async (req, res) => {
  try {
    const { name, city, address, about, employees } = req.body;
    const profilePicture = req.files?.profilePicture?.[0];
    const [minEmployees, maxEmployees] = employees.split("-").map(Number);

    await firmService.updateFirmProfile(req.user.id, {
      name,
      city,
      address,
      about,
      employees_range: `${minEmployees}-${maxEmployees}`,
      profilePicture
    });

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating firm profile:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};
