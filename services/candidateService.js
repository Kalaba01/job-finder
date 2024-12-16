const emailService = require("../services/emailService");
const userService = require("./userService");
const imageService = require("./imageService");
const { Candidate, Image } = require("../models");

exports.findCandidateByUserId = async(userId) => {
  try {
    const candidate = await Candidate.findOne({ where: { user_id: userId } });

    return candidate;
  } catch (error) {
    console.error("Error checking if candidate exists by user id:", error);
    throw error;
  }
}

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

exports.updateCandidate = async (candidate, updatedData) => {
  try {
    const { email, first_name, last_name } = updatedData;

    await candidate.update({
      first_name: first_name || candidate.first_name,
      last_name: last_name || candidate.last_name,
    });

    const user = await userService.findUserByEmail(email);

    await user.update({ email: email || user.email })

    return candidate;
  } catch (error) {
    console.error("Error updating candidate details:", error);
    throw new Error("Error updating candidate details.");
  }
};

exports.deleteCandidate = async (userId) => {
  try {
    const candidate = await Candidate.findOne({ where: { user_id: userId } });
    if (candidate && candidate.profile_picture_id) {
      await Image.destroy({ where: { id: candidate.profile_picture_id } });
    }
    await Candidate.destroy({ where: { user_id: userId } });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw new Error("Error deleting candidate.");
  }
};
