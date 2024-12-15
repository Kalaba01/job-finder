const userService = require("./userService");
const { Admin } = require("../models");

exports.createAdminAccount = async (email, password, transaction=null) => {
  try {
    const newUser = await userService.createUser(email, password, "admin", transaction);
    await Admin.create({ user_id: newUser.id }, { transaction });

    return newUser;
  } catch (error) {
    console.error("Error creating admin account:", error.message || error);
    throw new Error("Failed to create admin account.");
  }
};
