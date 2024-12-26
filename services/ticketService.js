const { Ticket, TicketConversation, User, Firm, Candidate, File } = require("../models");

exports.getTicketById = async(ticketId) => {
    try{
      const ticket = Ticket.findOne({ where: { id: ticketId } });

      return ticket;
    } catch (error) {
      console.error(`Error fetching ticket with ID: ${ticketId}`, error);
      throw new Error("Failed to retrieve ticket.");
    }
}

exports.getTickets = async ({ userId, userRole }) => {
  try {
    const query = {
      include: [
        {
          model: File,
          as: "Attachment",
          attributes: ["id", "file_name", "file_mime"],
        },
      ],
    };

    if (userRole !== "admin") query.where = { user_id: userId };

    const tickets = await Ticket.findAll(query);
    return tickets.map((ticket) => ({
      ...ticket.toJSON(),
      attachment: ticket.Attachment ? {
        id: ticket.Attachment.id,
        file_name: ticket.Attachment.file_name,
        file_mime: ticket.Attachment.file_mime
      } : null
    }));
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("Failed to fetch tickets.");
  }
};

exports.createTicket = async (ticketData) => {
  try {
    const { title, description, category, attachment } = ticketData;

    if (!title || !description || !category) throw new Error("Fields title, description, category are required.");

    let fileRecord = null;
    
    if (attachment) {
      fileRecord = await File.create({
        file: attachment.buffer,
        file_name: attachment.originalname,
        file_mime: attachment.mimetype,
      });
    }

    const newTicket = await Ticket.create({
      user_id: ticketData.user_id,
      user_role: ticketData.user_role,
      title,
      description,
      category,
      attachment_id: fileRecord ? fileRecord.id : null
    });

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
    const ticket = await this.getTicketById(ticketId);

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

exports.markAsResolved = async (ticketId) => {
  try {
    const ticket = await this.getTicketById(ticketId);

    if (!ticket) throw new Error("Ticket not found");

    ticket.status = "resolved";
    await ticket.save();
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw new Error("Failed to update ticket status.");
  }
};
