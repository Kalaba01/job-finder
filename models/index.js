const sequelize = require('../config/sequelize');

const User = require('./User');
const Admin = require('./Admin');
const Firm = require('./Firm');
const Candidate = require('./Candidate');
const Review = require('./Review');

module.exports = {
  sequelize,
  User,
  Admin,
  Firm,
  Candidate,
  Review,
};
