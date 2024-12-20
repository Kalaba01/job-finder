const imageService = require("./imageService");
const userService = require("./userService");
const { User, Firm, Image } = require("../models");

exports.firmExistsByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email, role: "firm" } });

    return user;
  } catch (error) {
    console.error("Error checking if firm exists by email:", error);
    throw error;
  }
};

exports.firmExistsByName = async (name) => {
  try {
    const firm = await Firm.findOne({ where: { name } });

    return firm;
  } catch (error) {
    console.error("Error checking if firm exists by name:", error);
    throw error;
  }
};

exports.firmExistsByUserId = async(userId) => {
  try {
    const firm = await Firm.findOne({ where: { user_id: userId } });

    return firm;
  } catch (error) {
    console.error("Error checking if firm exists by user id:", error);
    throw error;
  }
}

exports.createFirmAccount = async ( email, password, name, address, employees, transaction = null ) => {
  try {
    if (await this.firmExistsByEmail(email)) throw new Error("A user with this email already exists.");

    if (await this.firmExistsByName(name)) throw new Error("A firm with this name already exists.");

    const user = await userService.createUser(email, password, "firm", transaction);
    const defaultImage = await imageService.setDefaultPicture("firm", transaction);

    const firm = await Firm.create(
      {
        user_id: user.id,
        name,
        address,
        employees,
        profile_picture_id: defaultImage.id,
      },
      { transaction }
    );

    return { user, firm };
  } catch (error) {
    console.error("Error creating firm account:", error);
    throw new Error("Error creating firm account.");
  }
};

exports.getFirmDetails = async (userId, userDetails) => {
  try {
    const firm = await this.firmExistsByUserId(userId);
    if (firm) {
      userDetails.name = firm.name;
      userDetails.address = firm.address;
      userDetails.employees_range = firm.employees;
    }
    return userDetails;
  } catch (error) {
    console.error("Error fetching firm details:", error);
    throw new Error("Error fetching firm details.");
  }
};

exports.updateFirm = async (firm, updatedData) => {
  try {
    const { name, address, employees_range } = updatedData;

    await firm.update({
      name: name || firm.name,
      address: address || firm.address,
      employees: employees_range || firm.employees,
    });

    return firm;
  } catch (error) {
    console.error("Error updating firm details:", error);
    throw new Error("Error updating firm details.");
  }
};

exports.deleteFirm = async (userId) => {
  try {
    const firm = await Firm.findOne({ where: { user_id: userId } });
    if (firm && firm.profile_picture_id) {
      await Image.destroy({ where: { id: firm.profile_picture_id } });
    }
    await Firm.destroy({ where: { user_id: userId } });
  } catch (error) {
    console.error("Error deleting firm:", error);
    throw new Error("Error deleting firm.");
  }
};

exports.getFirmProfile = async (userId) => {
  try {
    const firm = await this.firmExistsByUserId(userId);

    if (!firm) throw new Error("Firm profile not found");

    const firmData = {
      name: firm.name || "N/A",
      address: firm.address || "N/A",
      about: firm.about || "N/A",
      employees: firm.employees || "N/A",
      profile_picture_id: firm.profile_picture_id || null,
    };

    return firmData;
  } catch (error) {
    console.error("Error fetching firm profile:", error);
    throw new Error("Failed to fetch firm profile.");
  }
};

exports.updateFirmProfile = async (userId, updatedData) => {
  try {
    const { name, address, about, employees_range, profilePicture } = updatedData;
    const firm = await this.firmExistsByUserId(userId);

    if (!firm) throw new Error("Firm not found");

    if (profilePicture) {
      if (firm.profile_picture_id) await imageService.replaceImage(profilePicture, firm.profile_picture_id);
      else throw new Error("Firm profile picture not found for replacement");
    }

    await firm.update({
      name: name || firm.name,
      address: address || firm.address,
      about: about || firm.about,
      employees: employees_range || firm.employees
    });

    return firm;
  } catch (error) {
    console.error("Error updating firm profile:", error);
    throw error;
  }
};
