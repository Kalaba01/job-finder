const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const { User, Candidate, FirmRequest, Image } = require("../models");
const emailService = require("../services/emailService");

exports.registerCandidate = async (candidateData) => {
  const { email, password, first_name, last_name } = candidateData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    role: "candidate",
  });

  const imagePath = path.join(
    __dirname,
    "../public/images/default-candidate.jpg"
  );
  const imageData = fs.readFileSync(imagePath);

  const newImage = await Image.create({
    data: imageData,
    mime_type: "image/jpeg",
  });

  const candidate = await Candidate.create({
    user_id: user.id,
    first_name,
    last_name,
    profile_picture_id: newImage.id,
  });

  const subject = "Welcome to Job Finder!";
  const templatePath = path.join(__dirname, "../views/emails/welcome.ejs");
  const cssPath = path.join(__dirname, "../public/styles/emails/welcome.css");
  const templateData = { first_name };

  await emailService.sendEmail(
    email,
    subject,
    templatePath,
    templateData,
    cssPath
  );

  return candidate;
};

exports.createFirmRequest = async (firmData) => {
  try {
    const { email, name, address, employees_range } = firmData;

    const existingPendingRequest = await FirmRequest.findOne({
      where: { email, status: "pending" },
    });

    if (existingPendingRequest) {
      throw new Error("You already have a pending registration request.");
    }

    const newRequest = await FirmRequest.create({
      email,
      name,
      address,
      employees_range
    });

    return newRequest;
  } catch (error) {
    console.error("Error creating firm request:", error);
    throw error;
  }
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

exports.login = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return reject(err);
      }

      if (!user) {
        return reject(new Error(info.message));
      }

      req.logIn(user, (err) => {
        if (err) {
          return reject(err);
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

        resolve({ redirectUrl });
      });
    })(req, res, next);
  });
};

exports.findUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};
