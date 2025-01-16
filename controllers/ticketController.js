const ticketService = require("../services/ticketService");

// Fetches and displays tickets for the logged-in user
exports.getTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const tickets = await ticketService.getTickets({ userId, userRole });

    if (userRole === "admin")res.render("./admin/admin-tickets", { tickets, locale: req.getLocale() });
    else res.render("firm-candidate/ticket-list", { tickets, userRole, locale: req.getLocale() });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).render("shared/error", { message: "Failed to load tickets." });
  }
};

// Creates a new ticket submitted by the logged-in user
exports.createTicket = async (req, res) => {
  try {
    const ticketData = {
      user_id: req.user.id,
      user_role: req.user.role,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      attachment: req.files && req.files.attachment ? req.files.attachment[0] : null
    };

    const newTicket = await ticketService.createTicket(ticketData);
    res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// Fetches and displays the conversation for a specific ticket
exports.getTicketConversation = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const { ticket, messages } = await ticketService.getTicketConversation({
      ticketId,
      userId,
      userRole
    });

    res.render("admin-firm-candidate/ticket-conversation", {
      ticket,
      messages,
      userRole,
      userId: req.user.id,
      locale: req.getLocale()
    });
  } catch (error) {
    console.error("Error fetching ticket conversation:", error);
    res.status(500).render("shared/error", { message: "Failed to load ticket conversation." });
  }
};

// Marks a ticket as resolved
exports.resolveTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    await ticketService.markAsResolved(ticketId);
    res.status(200).json({ message: "Ticket marked as resolved." });
  } catch (error) {
    console.error("Error resolving ticket:", error);
    res.status(500).json({ message: "Failed to resolve ticket." });
  }
};
