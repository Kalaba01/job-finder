const notificationService = require("../services/notificationService");

// Fetches all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marks a specific notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationService.markAsRead(id, req.user.id);
    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
