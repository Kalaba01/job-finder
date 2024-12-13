const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/sequelize");
const emailService = require("./emailService");
const { FirmRequest, User, Firm, PasswordResetToken, Image } = require("../models");

exports.getAllFirmRequests = async () => {
  try {
    return await FirmRequest.findAll({ order: [["createdAt", "DESC"]] });
  } catch (error) {
    console.error("Error fetching firm requests:", error);
    throw new Error("Error fetching firm requests.");
  }
};

exports.getFirmRequestById = async (id) => {
  try {
    return await FirmRequest.findByPk(id);
  } catch (error) {
    console.error("Error fetching firm request by ID:", error);
    throw new Error("Error fetching firm request by ID.");
  }
};

exports.firmExistsByEmail = async (email) => {
  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking if firm exists by email:", error);
    throw new Error("Error checking if firm exists by email.");
  }
};

exports.firmExistsByName = async (name) => {
  try {
    const firmExists = await Firm.findOne({ where: { name } });

    if (firmExists) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking if firm exists by name:", error);
    throw new Error("Error checking if firm exists by name.");
  }
};

exports.updateFirmRequestStatus = async (id, status) => {
  try {
    return await FirmRequest.update({ status }, { where: { id } });
  } catch (error) {
    console.error("Error updating firm request:", error);
    throw new Error("Error updating firm request.");
  }
};

exports.createFirmAccount = async ({ email, password, name, address, employees }) => {
  const transaction = await sequelize.transaction();
  try {
     const emailExists = await this.firmExistsByEmail(email);
     if (emailExists) {
       throw new Error("A user with this email already exists.");
     }
 
     const nameExists = await this.firmExistsByName(name);
     if (nameExists) {
       throw new Error("A firm with this name already exists.");
     }
     
    const user = await User.create(
      { email, password, role: "firm" },
      { transaction }
    );

     const imagePath = path.join(__dirname, "../public/images/default-firm.jpg");
     const imageData = fs.readFileSync(imagePath);
     const defaultImage = await Image.create(
       { data: imageData, mime_type: "image/jpeg" },
       { transaction }
     );

     const firm = await Firm.create(
      {
        user_id: user.id,
        name,
        address,
        employees,
        profile_picture_id: defaultImage.id
      },
      { transaction }
    );

    await transaction.commit();
    return { user, firm };
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating firm account:", error);
    throw new Error("Error creating firm account.");
  }
};

exports.handleFirmRequestUpdate = async (id, status) => {
  const firmRequest = await this.getFirmRequestById(id);

  if (!firmRequest) {
    throw new Error("Firm request not found.");
  }

  if (status === "approved") {
    const tempPassword = Date.now().toString();
    console.log("Temp password is: ", tempPassword)
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const { user, firm } = await this.createFirmAccount({
      email: firmRequest.email,
      password: hashedPassword,
      name: firmRequest.name,
      address: firmRequest.address,
      employees: firmRequest.employees_range
    });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await PasswordResetToken.create({
      user_id: user.id,
      token,
      expires_at: expiresAt
    });

    await this.updateFirmRequestStatus(id, "approved");

    const resetPasswordLink = `http://localhost:3000/reset-password?token=${token}`;
    const subject = "Welcome to Job Finder!";
    const templatePath = path.join(__dirname, "../views/emails/firm-approved.ejs");
    const cssPath = path.join(__dirname, "../public/styles/emails/firm-approved.css");
    const templateData = {
      firmName: firm.name,
      resetPasswordLink
    };

    await emailService.sendEmail(firmRequest.email, subject, templatePath, templateData, cssPath);

    return {
      message: "Firm approved and account created.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      firm: {
        id: firm.user_id,
        name: firm.name,
        address: firm.address,
        employees: firm.employees
      }
    };
  } else if (status === "rejected") {
    await this.updateFirmRequestStatus(id, "rejected");

    const subject = "Firm Registration Rejected";
    const templatePath = path.join(__dirname, "../views/emails/firm-rejected.ejs");
    const cssPath = path.join(__dirname, "../public/styles/emails/firm-rejected.css");
    const templateData = {
      firmName: firmRequest.name,
    };

    await emailService.sendEmail(firmRequest.email, subject, templatePath, templateData, cssPath);

    return { message: "Firm request rejected." };
  } else {
    throw new Error("Invalid status provided.");
  }
};
