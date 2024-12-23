const { saveMessageToDatabase } = require("../services/ticketService");

module.exports = (io, socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

  socket.on("join-ticket", (ticketId) => {
    socket.join(`ticket-${ticketId}`);
    console.log(`User ${userId} joined room ticket-${ticketId}`);
  });

  socket.on("send-message", async ({ ticketId, message, senderRole }) => {
    try {
      const senderId = userId;
      const newMessage = await saveMessageToDatabase(ticketId, message, senderRole, senderId);

      io.to(`ticket-${ticketId}`).emit("new-message", {
        id: newMessage.id,
        ticket_id: newMessage.ticket_id,
        sender_id: newMessage.sender_id,
        sender_role: newMessage.sender_role,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
        sender_name: getSenderNameFromMessage(newMessage)
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId} (Socket ID: ${socket.id})`);
  });
};

const getSenderNameFromMessage = (message) => {
  const sender = message.Sender;

  if (!sender) return "Unknown";

  switch (sender.role) {
    case "admin":
      return "Admin";
    case "firm":
      return sender.Firm ? sender.Firm.name : "Unknown Firm";
    case "candidate":
      return sender.Candidate
        ? `${sender.Candidate.first_name} ${sender.Candidate.last_name}`
        : "Unknown Candidate";
    default:
      return "Unknown";
  }
};
