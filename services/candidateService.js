const emailService = require("../services/emailService");
const userService = require("./userService");
const imageService = require("./imageService");
const { Candidate } = require("../models");

exports.registerCandidate = async (email, password, first_name, last_name, transaction=null) => {
  try {
    await userService.checkIfUserWithEmailExists(email);

    const user = await userService.createUser(email, password, "candidate", transaction);
    const defaultImage = await imageService.setDefaultPicture("candidate", transaction);

    const candidate = await Candidate.create({
      user_id: user.id,
      first_name,
      last_name,
      profile_picture_id: defaultImage.id,
    }, { transaction });

    await emailService.sendCandidateWelcomeEmail(email, first_name);
    return candidate;
  } catch (error) {
    console.error("Error registering candidate:", error.message || error);
    throw new Error("Failed to register candidate. Please try again later.");
  }
};
