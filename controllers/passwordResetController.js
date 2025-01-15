const passwordResetService = require("../services/passwordResetService");

exports.showResetPasswordForm = async (req, res) => {
  try {
    const { token } = req.query;
    await passwordResetService.validateResetPasswordToken(token);
    res.render("shared/reset-password", { token });
  } catch (error) {
    console.error("Reset password form error:", error);
    res.status(400).render("shared/error", { message: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await passwordResetService.sendResetPasswordLink(email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Password reset request error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.handlePasswordReset = async (req, res) => {
  try {
    const result = await passwordResetService.resetPassword(req.body);

    res.status(200).render("shared/success", result);
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(400).render("shared/error", { message: error.message });
  }
};
