const bcrypt = require("bcrypt");
const emailService = require("./emailService");
const firmService = require("./firmService");
const passwordResetService = require("./passwordResetService");
const { sequelize } = require("../models");
const { FirmRequest } = require("../models");

exports.checkPendingFirmRequest = async (email) => {
  try {
    const existingPendingRequest = await FirmRequest.findOne({
      where: { email, status: "pending" },
    });

    if (existingPendingRequest) throw new Error("You already have a pending registration request.");
  } catch (error) {
    console.error("Error checking pending firm request:", error.message || error);
    throw new Error("Failed to check pending registration request.");
  }
};

exports.getFirmRequestById = async (id) => {
  try {
    const firmRequest = await FirmRequest.findByPk(id);

    if (!firmRequest) throw new Error(`Firm request with ID ${id} not found.`);

    return firmRequest;
  } catch (error) {
    console.error("Error fetching firm request by ID:", error.message || error);
    throw new Error("Error fetching firm request by ID.");
  }
};

exports.createFirmRequest = async (firmData) => {
  try {
    const { email, name, city, address, employees_range } = firmData;

    await this.checkPendingFirmRequest(email);

    const newRequest = await FirmRequest.create({
      email,
      name,
      address,
      city,
      employees_range
    });

    return newRequest;
  } catch (error) {
    console.error("Error creating firm request:", error);
    throw error;
  }
};

exports.getAllFirmRequests = async () => {
  try {
    return await FirmRequest.findAll({ order: [["createdAt", "DESC"]] });
  } catch (error) {
    console.error("Error fetching firm requests:", error);
    throw new Error("Error fetching firm requests.");
  }
};

exports.updateFirmRequestStatus = async (id, status, transaction = null) => {
  try {
    return await FirmRequest.update(
      { status },
      { where: { id }, transaction }
    );
  } catch (error) {
    console.error("Error updating firm request:", error.message || error);
    throw new Error("Error updating firm request.");
  }
};

exports.handleFirmRequestUpdate = async (id, status) => {
  const transaction = await sequelize.transaction();
  try {
    const firmRequest = await this.getFirmRequestById(id);

    if (status === "approved") {
      const tempPassword = Date.now().toString();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const { user, firm } = await firmService.createFirmAccount(
        firmRequest.email,
        hashedPassword,
        firmRequest.name,
        firmRequest.address,
        firmRequest.employees_range,
        transaction
      );

      const { token } = await passwordResetService.createPasswordResetToken(user.id, transaction);
      await this.updateFirmRequestStatus(id, "approved", transaction);
      await transaction.commit();

      await emailService.sendFirmApprovedEmail(firmRequest.email, firmRequest.name, token);
      return {
        message: "Firm approved and account created.",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        firm: {
          id: firm.user_id,
          name: firm.name,
          address: firm.address,
          employees: firm.employees,
        },
      };
    } else if (status === "rejected") {
      await this.updateFirmRequestStatus(id, "rejected", transaction);
      await transaction.commit();

      await emailService.sendFirmRejectEmail(firmRequest.email, firmRequest.name);
      return { message: "Firm request rejected." };
    } else throw new Error("Invalid status provided.");
  } catch (error) {
    await transaction.rollback();
    console.error("Error handling firm request update:", error.message || error);
    throw new Error("Failed to handle firm request update.");
  }
};
