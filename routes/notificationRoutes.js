const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware");

router.use(authMiddleware.isAuthenticated);

// Notification routes
router.get("/", notificationController.getNotifications);
router.put("/:id/mark-read", notificationController.markAsRead);

module.exports = router;
