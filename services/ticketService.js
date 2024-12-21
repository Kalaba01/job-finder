const { Ticket } = require("../models");

exports.getTicketsByUser = async (userId, status, search) => {
  try {
    const query = { where: { user_id: userId } };

    if (status) query.where.status = status;
    if (search) query.where.title = { [Op.like]: `%${search}%` };

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
