const firmRequestService = require("../services/firmRequestService");

exports.getFirmRequests = async (req, res) => {
  try {
    const firmRequests = await firmRequestService.getAllFirmRequests();
    res.render("admin/company-approvals", { firmRequests, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching firm requests:", error);
    res.status(500).send("Error fetching firm requests.");
  }
};

exports.updateFirmRequest = async (req, res) => {
  const { id, status } = req.body;

  try {
    await firmRequestService.updateFirmRequestStatus(id, status);
    res.status(200).json({ message: "Request updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update request." });
  }
};
