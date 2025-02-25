const firmService = require("../services/firmService");
const dashboardService = require("../services/dashboardService");

// Retrieves and returns dashboard statistics for the firm
exports.getFirmDashboard = async (req, res) => {
  try {
    const firmId = req.user.id;
    const stats = await dashboardService.getFirmStats(firmId);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching firm dashboard stats:", error);
    res.status(500).send("Error loading firm dashboard.");
  }
};

// Displays the firm's profile page with its data
exports.showFirmProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const firmData = await firmService.getFirmProfile(userId);

    res.render("firm/firm-profile", { firm: firmData, locale: req.getLocale() });
  } catch (error) {
    console.error("Error displaying firm profile:", error);
    res.status(500).render("shared/error", { message: "Failed to load firm profile." });
  }
};

// Updates the firm's profile with new data 
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

// Fetches and displays details about a specific firm, including its open job ads
exports.getFirmDetails = async (req, res) => {
  try {
    const { firmId } = req.params;
    const firmDetails = await firmService.getFirmDetailsWithJobAds(firmId);
    res.render("firm/firm-details", { firmDetails });
  } catch (error) {
    console.error("Error fetching firm details:", error);
    res.status(500).send("Failed to fetch firm details.");
  }
};

// Displays the list of scheduled interviews for the firm
exports.showFirmInterviews = async (req, res) => {
  try {
    const firmId = req.user.id;
    const interviews = await firmService.getScheduledInterviews(firmId);

    res.render("firm/firm-interviews", { interviews, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching interviews:", error.message || error);
    res.status(500).send("An error occurred while fetching interviews.");
  }
};
