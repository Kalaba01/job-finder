const bcrypt = require("bcrypt");
const firmService = require("./firmService");
const adminService = require("./adminService");
const candidateService = require("./candidateService");
const sequelize = require("../config/sequelize");
const { User } = require("../models");

exports.checkIfUserWithEmailExists = async (email) => {
  if (!email) {
    throw new Error("Email is required for verification.");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email is already in use.");
  }
};

exports.createUser = async (email, password, role, transaction = null) => {
  try {
    await this.checkIfUserWithEmailExists(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ email, password: hashedPassword, role }, { transaction });
  } catch (error) {
    console.error("Error creating user:", error.message || error);
    throw new Error("Failed to create user.");
  }
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

exports.getAllUsers = async () => {
  try {
    return await User.findAll({
      attributes: ["id", "email", "role", "createdAt", "updatedAt"],
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users.");
  }
};

exports.addUser = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, password, role, name, address, employees_range, first_name, last_name } = userData;

    await this.checkIfUserWithEmailExists(email);
    let newUser;

    switch (role) {
      case "firm":
        if (!name || !address|| !employees_range) {
          throw new Error("Firm name and address are required for firms.");
        }
        newUser = await firmService.createFirmAccount(email, password, name, address, employees_range, transaction);
        break;

      case "candidate":
        if (!first_name || !last_name) {
          throw new Error("First name and last name are required for candidates.");
        }
        newUser = await candidateService.registerCandidate(email, password, first_name, last_name, transaction);
        break;

      case "admin":
        newUser = await adminService.createAdminAccount(email, password, transaction, transaction);
        break;

      default:
        throw new Error("Invalid role provided.");
    }

    await transaction.commit();
    return newUser;
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating user:", error);
    throw new Error(error.message || "Error creating user.");
  }
};

exports.updateUser = async (userId, updatedData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    return await user.update(updatedData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user.");
  }
};

exports.deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    await user.destroy();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user.");
  }
};
