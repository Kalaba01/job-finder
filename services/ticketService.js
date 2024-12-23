const { Ticket, TicketConversation, User, Firm, Candidate } = require("../models");

exports.getTickets = async ({ userId, userRole }) => {
  try {
    const query = {};
    if (userRole !== "admin") query.where = { user_id: userId };

    const tickets = await Ticket.findAll(query);
    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("Failed to fetch tickets.");
  }
};

exports.createTicket = async (ticketData) => {
  try {
    if (!ticketData.title || !ticketData.description || !ticketData.category) {
      throw new Error("Fields title, description, category are required.");
    }

    const newTicket = await Ticket.create(ticketData);
    return newTicket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw new Error("Failed to create ticket.");
  }
};

const getSenderName = async (user, userId, userRole) => {
  if (!user) return "Unknown";

  switch (user.role) {
    case "admin":
      return "Admin";

      case "firm":
        if (user.Firm && user.Firm.name) {
          return user.Firm.name;
        }
        if (user.id === userId && userRole === "firm") {
          const firm = await Firm.findOne({ where: { user_id: user.id } });
          return firm ? firm.name : "Unknown";
        }
        return "Unknown";

    case "candidate":
      if (user.Candidate) return `${user.Candidate.first_name} ${user.Candidate.last_name}`;
      break;

    default:
      return "Unknown";
  }
};

exports.getTicketConversation = async ({ ticketId, userId, userRole }) => {
  try {
    const ticket = await Ticket.findOne({ where: { id: ticketId } });

    if (!ticket) throw new Error("Ticket not found");
    if (userRole !== "admin" && ticket.user_id !== userId) throw new Error("Unauthorized access to ticket");

    const messages = await TicketConversation.findAll({
      where: { ticket_id: ticketId },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "role"],
          include: [
            {
              model: Firm,
              as: "Firm",
              attributes: ["name"]
            },
            {
              model: Candidate,
              as: "Candidate",
              attributes: ["first_name", "last_name"]
            }
          ]
        }
      ],
      order: [["createdAt", "ASC"]]
    });

    const mappedMessages = await Promise.all(
      messages.map(async (message) => {
        const senderName = await getSenderName(message.Sender, userId, userRole);
        return {
          ...message.toJSON(),
          sender_name: senderName
        };
      })
    );

    return { ticket, messages: mappedMessages };
  } catch (error) {
    console.error("Error fetching ticket conversation:", error);
    throw new Error("Failed to fetch ticket conversation.");
  }
};

exports.saveMessageToDatabase = async (ticketId, message, senderRole, senderId) => {
  try {
    const newMessage = await TicketConversation.create({
      ticket_id: ticketId,
      sender_id: senderId,
      message: message,
      sender_role: senderRole,
    });

    const fullMessage = await TicketConversation.findOne({
      where: { id: newMessage.id },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "role"],
          include: [
            {
              model: Firm,
              as: "Firm",
              attributes: ["name"],
            },
            {
              model: Candidate,
              as: "Candidate",
              attributes: ["first_name", "last_name"],
            },
          ],
        },
      ],
    });

    return fullMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};
