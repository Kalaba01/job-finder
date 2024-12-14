const { User, Firm, Candidate, Admin } = require("../models");
const bcrypt = require("bcrypt");
const sequelize = require("../config/sequelize");

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

exports.createUser = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, password, role, name, address, first_name, last_name } =
      userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email is already in use.");
    }

    switch (role) {
      case "firm":
        if (!name || !address) {
          throw new Error("Firm name and address are required for firms.");
        }
        break;
      case "candidate":
        if (!first_name || !last_name) {
          throw new Error(
            "First name and last name are required for candidates."
          );
        }
        break;
      case "admin":
        break;
      default:
        throw new Error("Invalid role provided.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      { email, password: hashedPassword, role },
      { transaction }
    );

    switch (role) {
      case "firm":
        await Firm.create(
          { user_id: newUser.id, name, address },
          { transaction }
        );
        break;
      case "candidate":
        await Candidate.create(
          { user_id: newUser.id, first_name, last_name },
          { transaction }
        );
        break;
      case "admin":
        await Admin.create({ user_id: newUser.id }, { transaction });
        break;
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
