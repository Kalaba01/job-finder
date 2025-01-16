const bcrypt = require("bcrypt");
const firmService = require("./firmService");
const adminService = require("./adminService");
const candidateService = require("./candidateService");
const sequelize = require("../config/sequelize");
const { User } = require("../models");

// Find a user by their email address
exports.findUserByEmail = async (email) => {
  try {
    if (!email) throw new Error("Email is required for verification.");

    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("An error occurred while verifying the email.");
  }
};

// Find a user by their ID
exports.findUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

// Create a new user
exports.createUser = async (email, password, role, transaction = null) => {
  try {
    if (await this.findUserByEmail(email)) throw new Error("Email is already in use.");

    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ email, password: hashedPassword, role }, { transaction });
  } catch (error) {
    console.error("Error creating user:", error.message || error);
    throw new Error("Failed to create user.");
  }
};

// Retrieve all users with basic information
exports.getAllUsers = async () => {
  try {
    return await User.findAll({
      attributes: ["id", "email", "role", "createdAt", "updatedAt"]
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users.");
  }
};

// Get detailed information about a specific user
exports.getUserDetails = async (userId) => {
  try {
    const user = await this.findUserById(userId);

    if (!user) throw new Error("User not found.");

    const userDetails = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    if (user.role === "firm") return await firmService.getFirmDetails(userId, userDetails);
    else if (user.role === "candidate") return await candidateService.getCandidateDetails(userId, userDetails);
    
    return userDetails;
  } catch (error) {
    console.error("Error fetching user details:", error.message || error);
    throw new Error("Error fetching user details.");
  }
};

// Add a new user
exports.addUser = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, password, role, name, city, address, employees_range, first_name, last_name } = userData;

    if (await this.findUserByEmail(email)) throw new Error("Email is already in use.");
    let newUser;

    switch (role) {
      case "firm":
        if (!name || !address|| !employees_range) throw new Error("Firm name and address are required for firms.");
        newUser = await firmService.createFirmAccount(email, password, name, city, address, employees_range, transaction);
        break;

      case "candidate":
        if (!first_name || !last_name) throw new Error("First name and last name are required for candidates.");
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

// Update user details
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

// Delete a user
exports.deleteUser = async (userId) => {
  try {
    const user = await this.findUserById(userId);
    if (!user) throw new Error("User not found.");
    
    if (user.role === "admin") await adminService.deleteAdmin(userId); 
    else if (user.role === "firm") await firmService.deleteFirm(userId);
    else if (user.role === "candidate") await candidateService.deleteCandidate(userId);

    await user.destroy();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user.");
  }
};
