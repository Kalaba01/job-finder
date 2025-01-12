const { Notification } = require("../models");

exports.getNotifications = async (userId) => {
  return Notification.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]]
  });
};

exports.markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId }
  });
  if (!notification) throw new Error("Notification not found.");
  notification.read = true;
  await notification.save();
};
