const passwordResetService = require("../services/passwordResetService");

exports.showResetPasswordForm = async (req, res) => {
  try {
    const { token } = req.query;
    await passwordResetService.validateResetPasswordToken(token);
    res.render("reset-password", { token });
  } catch (error) {
    console.error("Reset password form error:", error);
    res.status(400).render("error", { message: error.message });
  }
};

exports.handlePasswordReset = async (req, res) => {
  try {
    const result = await passwordResetService.resetPassword(req.body);

    res.status(200).render("success", result);
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(400).render("error", { message: error.message });
  }
};
