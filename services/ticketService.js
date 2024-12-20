const { Ticket } = require("../models");

exports.getTicketsByUser = async (userId, status, search) => {
  try {
    const query = { where: { user_id: userId } };

    if (status) {
      query.where.status = status;
    }

    if (search) {
      query.where.title = { [Op.like]: `%${search}%` };
    }

    const tickets = await Ticket.findAll(query);
    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("Failed to fetch tickets.");
  }
};
