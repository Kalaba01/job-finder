const { Notification } = require("../models");

module.exports = (io, socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`User connected for notifications: ${userId} (Socket ID: ${socket.id})`);

  socket.on("join-notifications", () => {
    if (userId) {
      socket.join(`notifications-${userId}`);
      console.log(`User ${userId} joined notifications room`);
    }
  });

  const sendNotification = async (userId, message, type) => {
    try {
      const notification = await Notification.create({
        user_id: userId,
        message,
        type
      });

      io.to(`notifications-${userId}`).emit("new-notification", {
        id: notification.id,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt
      });

      console.log(`Notification sent to user ${userId}: ${message}`);
    } catch (error) {
      console.error("Error sending notification:", error.message || error);
    }
  };

  socket.on("disconnect", () => {
    console.log(`User disconnected from notifications: ${userId} (Socket ID: ${socket.id})`);
  });

  return { sendNotification };
};
