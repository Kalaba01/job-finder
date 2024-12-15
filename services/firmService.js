const imageService = require("./imageService");
const userService = require("./userService");
const { User, Firm } = require("../models");

exports.firmExistsByEmail = async (email) => {
  try {
    const userExists = await User.findOne({
      where: {
        email,
        role: "firm",
      },
    });

    if (userExists) {
      throw new Error("A user with this email already exists.");
    }
  } catch (error) {
    console.error("Error checking if firm exists by email:", error);
    throw error;
  }
};

exports.firmExistsByName = async (name) => {
  try {
    const firmExists = await Firm.findOne({ where: { name } });

    if (firmExists) {
      throw new Error("A firm with this name already exists.");
    }
  } catch (error) {
    console.error("Error checking if firm exists by name:", error);
    throw error;
  }
};

exports.createFirmAccount = async ( email, password, name, address, employees, transaction = null ) => {
  try {
    await this.firmExistsByEmail(email);
    await this.firmExistsByName(name);

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
