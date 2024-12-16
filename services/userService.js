const bcrypt = require("bcrypt");
const firmService = require("./firmService");
const adminService = require("./adminService");
const candidateService = require("./candidateService");
const sequelize = require("../config/sequelize");
const { User, Firm, Candidate, Admin, Image } = require("../models");

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

exports.getUserDetails = async (userId) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const userDetails = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.role === "firm") {
      const firm = await Firm.findOne({ where: { user_id: user.id } });
      if (firm) {
        userDetails.name = firm.name;
        userDetails.address = firm.address;
        userDetails.employees_range = firm.employees;
      }
    } else if (user.role === "candidate") {
      const candidate = await Candidate.findOne({ where: { user_id: user.id } });
      if (candidate) {
        userDetails.first_name = candidate.first_name;
        userDetails.last_name = candidate.last_name;
      }
    }

    return userDetails;
  } catch (error) {
    console.error("Error fetching user details:", error.message || error);
    throw new Error("Error fetching user details.");
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
    const user = await this.findUserById(userId);
    if (!user) throw new Error("User not found.");

    await user.update(updatedData);

    if (user.role === "firm") {
      const firm = await firmService.firmExistsByUserId(userId);
      if (!firm) throw new Error("Firm details not found.");

      await firmService.updateFirm(firm, updatedData);
    } else if (user.role === "candidate") {
      const candidate = await candidateService.findCandidateByUserId(userId);
      if (!candidate) throw new Error("Candidate details not found.");

      await candidateService.updateCandidate(candidate, updatedData);
    }

    return user;
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

    if (user.role === "admin") {
      await Admin.destroy({ where: { user_id: userId } });
    } else if (user.role === "firm") {
      const firm = await Firm.findOne({ where: { user_id: userId } });
      if (firm && firm.profile_picture_id) {
        await Image.destroy({ where: { id: firm.profile_picture_id } });
      }
      await Firm.destroy({ where: { user_id: userId } });
    } else if (user.role === "candidate") {
      const candidate = await Candidate.findOne({ where: { user_id: userId } });
      if (candidate && candidate.profile_picture_id) {
        await Image.destroy({ where: { id: candidate.profile_picture_id } });
      }
      await Candidate.destroy({ where: { user_id: userId } });
    }

    await user.destroy();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user.");
  }
};
