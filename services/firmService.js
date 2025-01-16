const imageService = require("./imageService");
const userService = require("./userService");
const { User, Firm, JobAd, Image, InterviewInvite, Candidate, HiringProcess } = require("../models");

// Check if a firm exists based on the email
exports.firmExistsByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email, role: "firm" } });

    return user;
  } catch (error) {
    console.error("Error checking if firm exists by email:", error);
    throw error;
  }
};

// Check if a firm exists based on the name
exports.firmExistsByName = async (name) => {
  try {
    const firm = await Firm.findOne({ where: { name } });

    return firm;
  } catch (error) {
    console.error("Error checking if firm exists by name:", error);
    throw error;
  }
};

// Check if a firm exists based on ID
exports.firmExistsByUserId = async(userId) => {
  try {
    const firm = await Firm.findOne({ where: { user_id: userId } });

    return firm;
  } catch (error) {
    console.error("Error checking if firm exists by user id:", error);
    throw error;
  }
}

// Create a new firm account
exports.createFirmAccount = async ( email, password, name, city, address, employees, transaction = null ) => {
  try {
    if (await this.firmExistsByEmail(email)) throw new Error("A user with this email already exists.");
    if (await this.firmExistsByName(name)) throw new Error("A firm with this name already exists.");

    const user = await userService.createUser(email, password, "firm", transaction);
    const defaultImage = await imageService.setDefaultPicture("firm", transaction);

    const firm = await Firm.create(
      {
        user_id: user.id,
        name,
        city,
        address,
        employees,
        profile_picture_id: defaultImage.id
      },
      { transaction }
    );

    return { user, firm };
  } catch (error) {
    console.error("Error creating firm account:", error);
    throw new Error("Error creating firm account.");
  }
};

// Get firm details
exports.getFirmDetails = async (userId, userDetails) => {
  try {
    const firm = await this.firmExistsByUserId(userId);
    if (firm) {
      userDetails.name = firm.name;
      userDetails.city = firm.city;
      userDetails.address = firm.address;
      userDetails.employees_range = firm.employees;
    }
    return userDetails;
  } catch (error) {
    console.error("Error fetching firm details:", error);
    throw new Error("Error fetching firm details.");
  }
};

// Fetch firm details
exports.getFirmDetailsWithJobAds = async (firmId) => {
  try {
    const firm = await Firm.findByPk(firmId, {
      include: [
        {
          model: JobAd,
          as: "JobAds",
          where: { status: "open" },
          required: false
        }
      ],
      attributes: ["name", "city", "address", "about", "employees", "profile_picture_id"]
    });

    if (!firm) throw new Error("Firm not found");

    return {
      id: firm.id,
      name: firm.name,
      city: firm.city,
      address: firm.address || "N/A",
      about: firm.about || "No additional information about this company.",
      employees: firm.employees || "N/A",
      profile_picture_id: firm.profile_picture_id || null,
      jobAds: firm.JobAds || []
    };
  } catch (error) {
    console.error("Error fetching firm details with job ads:", error);
    throw error;
  }
};

// Update details of an existing firm
exports.updateFirm = async (firm, updatedData) => {
  try {
    const { name, city, address, employees_range } = updatedData;

    await firm.update({
      name: name || firm.name,
      city: city || firm.city,
      address: address || firm.address,
      employees: employees_range || firm.employees
    });

    return firm;
  } catch (error) {
    console.error("Error updating firm details:", error);
    throw new Error("Error updating firm details.");
  }
};

// Delete a firm
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

// Fetch a firm's profile
exports.getFirmProfile = async (userId) => {
  try {
    const firm = await this.firmExistsByUserId(userId);

    if (!firm) throw new Error("Firm profile not found");

    const firmData = {
      name: firm.name || "N/A",
      city: firm.city || "N/A",
      address: firm.address || "N/A",
      about: firm.about || "N/A",
      employees: firm.employees || "N/A",
      profile_picture_id: firm.profile_picture_id || null
    };

    return firmData;
  } catch (error) {
    console.error("Error fetching firm profile:", error);
    throw new Error("Failed to fetch firm profile.");
  }
};

// Update a firm's profile
exports.updateFirmProfile = async (userId, updatedData) => {
  try {
    const { name, city, address, about, employees_range, profilePicture } = updatedData;
    const firm = await this.firmExistsByUserId(userId);

    if (!firm) throw new Error("Firm not found");

    if (profilePicture) {
      if (firm.profile_picture_id) await imageService.replaceImage(profilePicture, firm.profile_picture_id);
      else throw new Error("Firm profile picture not found for replacement");
    }

    await firm.update({
      name: name || firm.name,
      city: city || firm.city,
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

// Fetch scheduled interviews for a firm
exports.getScheduledInterviews = async (firmId) => {
  try {
    const interviews = await InterviewInvite.findAll({
      where: { firm_id: firmId },
      include: [
        {
          model: Candidate,
          as: "Candidate",
          attributes: ["first_name", "last_name"]
        },
      ],
      attributes: ["id", "scheduled_date"],
      order: [["scheduled_date", "ASC"]]
    });

    return interviews.map((interview) => ({
      id: interview.id,
      candidateName: `${interview.Candidate?.first_name || "Unknown"} ${interview.Candidate?.last_name || "Unknown"}`,
      scheduledDate: interview.scheduled_date
    }));
  } catch (error) {
    console.error("Error fetching scheduled interviews:", error.message || error);
    throw new Error("Failed to fetch scheduled interviews.");
  }
};
