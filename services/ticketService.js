const { Ticket } = require("../models");

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
