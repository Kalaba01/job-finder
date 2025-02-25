const firmRequestService = require("../services/firmRequestService");
const userService = require("../services/userService");
const dashboardService = require("../services/dashboardService");

// Fetch statistics for the admin dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getAdminStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats." });
  }
};

// Fetch all firm requests
exports.getFirmRequests = async (req, res) => {
  try {
    const firmRequests = await firmRequestService.getAllFirmRequests();
    res.render("admin/admin-company-approvals", { firmRequests, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching firm requests:", error);
    res.status(500).send("Error fetching firm requests.");
  }
};

// Update the status of a firm request
exports.updateFirmRequest = async (req, res) => {
  const { id, status } = req.body;

  try {
    const result = await firmRequestService.handleFirmRequestUpdate(id, status);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating firm request:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch all users for admin
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.render("admin/admin-users", { users, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users.");
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { email, password, role, city, employees_range, ...extraData } = req.body;

    if (role === "firm" && (!extraData.name || !city || !employees_range)) {
      throw new Error("Firm name is required for firms.");
    }
    if (role === "candidate" && (!extraData.first_name || !extraData.last_name)) {
      throw new Error("First name and last name are required for candidates.");
    }

    const userData = { email, password, role, city, employees_range, ...extraData };
    const newUser = await userService.addUser(userData);
    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: error.message || "Failed to add user." });
  }
};

// Fetch detailed information about a specific user
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetails = await userService.getUserDetails(userId);

    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error.message || error);
    res.status(500).json({ message: error.message || "Error fetching user details." });
  }
};

// Edit an existing user's information
exports.editUser = async (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const updatedData = req.body;
    const updatedUser = await userService.updateUser(userId, updatedData);
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error editing user:", error);
    res.status(500).json({ message: "Failed to update user." });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};
