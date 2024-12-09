const authService = require('../services/authService');
const passport = require("passport");

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

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

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
          redirectUrl = "/";
      }

      res.json({ redirectUrl });
    });
  })(req, res, next);
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
