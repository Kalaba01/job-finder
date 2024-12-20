const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { authMiddleware } = require("../middleware");

// Middleware za autentikaciju
router.use(authMiddleware.isAuthenticated);

// Prikaz ticketa
router.get("/", ticketController.getTickets);

module.exports = router;
