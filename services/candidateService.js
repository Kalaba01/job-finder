const emailService = require("../services/emailService");
const userService = require("./userService");
const imageService = require("./imageService");
const fileService = require("./fileService");
const { User, Candidate, Image, File } = require("../models");

exports.checkIfCandidateWithEmailExists = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email: email,
        role: "candidate",
      },
    });

    if (user) throw new Error("User with this email already exists as a candidate.");
  } catch (error) {
    console.error("Error checking if user with email exists:", error.message || error);
    throw error;
  }
};

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
    await this.checkIfCandidateWithEmailExists(email);

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

exports.getCandidateDetails = async (userId, userDetails) => {
  try {
    const candidate = await this.findCandidateByUserId(userId);
    if (candidate) {
      userDetails.first_name = candidate.first_name;
      userDetails.last_name = candidate.last_name;
    }
    return userDetails;
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    throw new Error("Error fetching candidate details.");
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

exports.getCandidateProfile = async (userId) => {
  try {
    const candidate = await this.findCandidateByUserId(userId);

    const candidateData = {
      id: candidate?.user_id || null,
      first_name: candidate?.first_name || "N/A",
      last_name: candidate?.last_name || "N/A",
      about: candidate?.about || "N/A",
      cv_file_id: candidate?.cv_file_id || null,
      motivation_file_id: candidate?.motivation_file_id || null,
      recommendations_file_id: candidate?.recommendations_file_id || null,
      profile_picture_id: candidate?.profile_picture_id || null,
    };

    return candidateData;
  } catch (error) {
    console.error("Error fetching candidate profile:", error);
    throw new Error("Failed to fetch candidate profile.");
  }
};

exports.updateCandidateProfile = async (userId, { first_name, last_name, about, cv, motivation_letter, recommendations, profilePicture }) => {
  try {
    const candidate = await Candidate.findOne({ where: { user_id: userId } });

    if (!candidate) throw new Error("Candidate not found.");

    await candidate.update({
      first_name: first_name || candidate.first_name,
      last_name: last_name || candidate.last_name,
      about: about || candidate.about
    });

    if (cv) candidate.cv_file_id = (await fileService.saveFile(cv)).id;
    if (motivation_letter) candidate.motivation_file_id = (await fileService.saveFile(motivation_letter)).id;
    if (recommendations) candidate.recommendations_file_id = (await fileService.saveFile(recommendations)).id;

    if (profilePicture) {
      if (candidate.profile_picture_id) await imageService.replaceImage(profilePicture, candidate.profile_picture_id);
      else throw new Error("Candidate profile picture not found for replacement");
    }

    await candidate.save();
  } catch (error) {
    console.error("Error updating candidate profile:", error);
    throw new Error("Failed to update candidate profile.");
  }
};
