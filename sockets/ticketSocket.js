const { saveMessageToDatabase } = require("../services/ticketService");
const { Ticket } = require("../models");
const notificationSocket = require("./notificationSocket");
const ticketService = require("../services/ticketService");

module.exports = (io, socket) => {
  const userId = socket.request.session.passport.user;

  console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

  socket.on("join-ticket", (ticketId) => {
    socket.join(`ticket-${ticketId}`);
    console.log(`User ${userId} joined room ticket-${ticketId}`);
  });

  socket.on("mark-resolved", async (ticketId) => {
    try {
      const ticket = await ticketService.getTicketById(ticketId);

      if (!ticket) {
        console.error(`Ticket ${ticketId} not found.`);
        return;
      }

      io.to(`ticket-${ticketId}`).emit("ticket-resolved", {
        ticketId,
        status: "resolved"
      });

      console.log(`Ticket ${ticketId} resolved.`);

      const message = `Your ticket with ID #${ticket.id} has been resolved.`;
      notificationSocket(io, socket).sendNotification(ticket.user_id, message, "ticket-status");

    } catch (error) {
      console.error("Error emitting ticket resolved event:", error);
    }
  });

  socket.on("send-message", async ({ ticketId, message, senderRole }) => {
    try {
      const ticket = await Ticket.findOne({ where: { id: ticketId } });
      if (ticket.status === "resolved") {
        console.warn(`Message blocked: Ticket ${ticketId} is resolved.`);
        return;
      }
  
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
