const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { authMiddleware, uploadMiddleware } = require("../middleware");

// Routes for managing support tickets
router.use(authMiddleware.isAuthenticated);
router.post("/", uploadMiddleware, ticketController.createTicket);
router.put("/resolve/:ticketId", authMiddleware.isAdmin, ticketController.resolveTicket);

module.exports = router;
