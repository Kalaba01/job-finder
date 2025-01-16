const { Notification } = require("../models");

// Fetch all notifications for a specific user
exports.getNotifications = async (userId) => {
  return Notification.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]]
  });
};

// Mark a specific notification as read
exports.markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId }
  });
  if (!notification) throw new Error("Notification not found.");
  notification.read = true;
  await notification.save();
};
