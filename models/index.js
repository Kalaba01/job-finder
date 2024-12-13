const sequelize = require("../config/sequelize");

const User = require("./User");
const Admin = require("./Admin");
const Firm = require("./Firm");
const Candidate = require("./Candidate");
const Review = require("./Review");
const FirmRequest = require("./FirmRequest");
const Image = require("./Image");
const PasswordResetToken = require("./PasswordResetToken");

module.exports = {
  sequelize,
  User,
  Admin,
  Firm,
  Candidate,
  Review,
  FirmRequest,
  Image,
  PasswordResetToken
};
