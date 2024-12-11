const firmRequestService = require("../services/firmRequestService");

exports.getFirmRequests = async (req, res) => {
  try {
    const firmRequests = await firmRequestService.getAllFirmRequests();
    res.render("admin/company-approvals", { firmRequests });
  } catch (error) {
    console.error("Error fetching firm requests:", error);
    res.status(500).send("Error fetching firm requests.");
  }
};

exports.updateFirmRequest = async (req, res) => {
  const { id, status } = req.body;
  try {
    await firmRequestService.updateFirmRequestStatus(id, status);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating firm request:", error);
    res.status(500).json({ success: false, error: "Error updating firm request." });
  }
};
