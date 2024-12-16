const imageService = require("./imageService");
const userService = require("./userService");
const { User, Firm } = require("../models");

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
