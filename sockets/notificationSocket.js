const { Notification } = require("../models");

// Manages real-time notifications for connected users
module.exports = (io, socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`User connected for notifications: ${userId} (Socket ID: ${socket.id})`);

  // Joins the user to their specific notification room for real-time updates
  socket.on("join-notifications", () => {
    if (userId) {
      socket.join(`notifications-${userId}`);
      console.log(`User ${userId} joined notifications room`);
    }
  });

  // Sends a notification to a specific user and emits it to their notification room
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
