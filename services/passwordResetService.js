const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { User, PasswordResetToken } = require("../models");
const userService = require("./userService");
const emailService = require("./emailService");

exports.createPasswordResetToken = async (userId, transaction = null) => {
  try {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await PasswordResetToken.create(
      {
        user_id: userId,
        token,
        expires_at: expiresAt,
      },
      { transaction }
    );

    return { token, expiresAt };
  } catch (error) {
    console.error("Error creating password reset token:", error.message || error);
    throw new Error("Failed to create password reset token.");
  }
};

exports.validateResetPasswordToken = async (token) => {
  const resetToken = await PasswordResetToken.findOne({
    where: { token, expires_at: { [Op.gt]: new Date() } },
  });

  if (!resetToken) throw new Error("Invalid or expired token");

  return resetToken;
};

exports.sendResetPasswordLink = async (email) => {
  const user = await userService.findUserByEmail(email);
  if (!user) throw new Error("No account found with that email.");

  const { token } = await this.createPasswordResetToken(user.id);

  await emailService.sendPasswordResetEmail(email, token);

  return { message: "Password reset link sent successfully" };
};

exports.resetPassword = async ({ token, newPassword, confirmPassword }) => {
  if (!token || !newPassword || !confirmPassword) throw new Error("Token, new password, and confirm password are required");

  if (newPassword !== confirmPassword) throw new Error("Passwords do not match");

  const resetToken = await this.validateResetPasswordToken(token);
  const user = await User.findByPk(resetToken.user_id);

  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });
  await resetToken.destroy();

  return { message: "Password reset successfully" };
};
