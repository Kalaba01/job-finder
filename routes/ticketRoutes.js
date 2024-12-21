const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { authMiddleware, uploadMiddleware } = require("../middleware");

// Middleware za autentikaciju
router.use(authMiddleware.isAuthenticated);

// Kreiranje novog tiketa od strane firme/kandidata
router.post("/", uploadMiddleware, ticketController.createTicket);

module.exports = router;
