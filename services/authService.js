const bcrypt = require('bcrypt');
const path = require("path");
const { User, Candidate, FirmRequest } = require('../models');
const emailService = require("../services/emailService");

exports.registerCandidate = async (candidateData) => {
  const { email, password, first_name, last_name } = candidateData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    role: 'candidate',
  });

  const candidate = await Candidate.create({
    user_id: user.id,
    first_name,
    last_name,
  });

  const subject = "Welcome to Job Finder!";
  const templatePath = path.join(__dirname, "../views/emails/welcome.ejs");
  const cssPath = path.join(__dirname, "../public/styles/emails/welcome.css");
  const templateData = { first_name };

  await emailService.sendEmail(email, subject, templatePath, templateData, cssPath);

  return candidate;
};

exports.createFirmRequest = async (firmData) => {
  const { email, name, address, employees_range } = firmData;

  const existingRequest = await FirmRequest.findOne({ where: { email } });
  if (existingRequest) {
    throw new Error('A registration request for this email already exists');
  }

  const newRequest = await FirmRequest.create({
    email,
    name,
    address,
    employees_range
  });

  return newRequest;
};

exports.authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

exports.findUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};
