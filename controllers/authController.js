const authService = require('../services/authService');

exports.registerCandidate = async (req, res) => {
  try {
    const candidateData = req.body;
    const newCandidate = await authService.registerCandidate(candidateData);
    res.status(201).json({ message: "Candidate registered successfully" });
  } catch (error) {
    console.error("Error registering candidate:", error);
    res.status(500).json({ error: "Failed to register candidate" });
  }
};

exports.registerFirmRequest = async (req, res) => {
  try {
    const firmData = req.body;
    const newRequest = await authService.createFirmRequest(firmData);
    res.status(201).json({ message: 'Firm registration request submitted successfully' });
  } catch (error) {
    console.error('Error submitting firm registration request:', error);
    res.status(500).json({ error: 'Failed to submit firm registration request' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.authenticateUser(email, password);

    if (user) {
      let redirectUrl;
      switch (user.role) {
        case "admin":
          redirectUrl = "/admin/";
          break;
        case "firm":
          redirectUrl = "/firm/";
          break;
        case "candidate":
          redirectUrl = "/candidate/";
          break;
        default:
          return res.status(400).json({ error: "Invalid user role" });
      }
      res.json({ redirectUrl });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
