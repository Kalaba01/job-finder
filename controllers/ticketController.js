const ticketService = require("../services/ticketService");

exports.getTickets = async (req, res) => {
  try {
    const { status, search } = req.query;
    const userId = req.user.id;

    const tickets = await ticketService.getTicketsByUser(userId, status, search);

    res.render("./ticket-list", {
      tickets,
      userRole: req.user.role,
      locale: req.getLocale(),
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).render("error", { message: "Failed to load tickets." });
  }
};
