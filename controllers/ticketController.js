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

exports.createTicket = async (req, res) => {
  try {
    const ticketData = {
      user_id: req.user.id,
      user_role: req.user.role,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      attachment: req.files.attachment ? req.files.attachment[0].buffer : null
    };

    const newTicket = await ticketService.createTicket(ticketData);
    res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};
