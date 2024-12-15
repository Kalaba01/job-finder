const authService = require('../services/authService');
const candidateService = require("../services/candidateService");
const firmRequestService = require("../services/firmRequestService");

exports.registerCandidate = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const newCandidate = await candidateService.registerCandidate(email, password, first_name, last_name);
    res.status(201).json({ message: "Candidate registered successfully" });
  } catch (error) {
    console.error("Error registering candidate:", error);
    res.status(500).json({ error: "Failed to register candidate" });
  }
};

exports.registerFirmRequest = async (req, res) => {
  try {
    const firmData = req.body;
    const newRequest = await firmRequestService.createFirmRequest(firmData);
    res.status(201).json({ message: 'Firm registration request submitted successfully' });
  } catch (error) {
    console.error('Error submitting firm registration request:', error);
    res.status(500).json({ error: 'Failed to submit firm registration request' });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { redirectUrl } = await authService.login(req, res, next);
    res.json({ redirectUrl });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ success: true, message: "Logged out successfully" });
    });
  });
};
