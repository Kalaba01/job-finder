const bcrypt = require("bcrypt");
const { User, PasswordResetToken } = require("../models");
const { Op } = require("sequelize");

exports.validateResetPasswordToken = async (token) => {
  const resetToken = await PasswordResetToken.findOne({
    where: { token, expires_at: { [Op.gt]: new Date() } },
  });

  if (!resetToken) {
    throw new Error("Invalid or expired token");
  }

  return resetToken;
};

exports.resetPassword = async ({ token, newPassword, confirmPassword }) => {
  if (!token || !newPassword || !confirmPassword) {
    throw new Error("Token, new password, and confirm password are required");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const resetToken = await this.validateResetPasswordToken(token);
  const user = await User.findByPk(resetToken.user_id);

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });
  await resetToken.destroy();

  return { message: "Password reset successfully" };
};
