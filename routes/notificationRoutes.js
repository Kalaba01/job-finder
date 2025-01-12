const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware");

router.use(authMiddleware.isAuthenticated);

// Dohvatanje svih notifikacija
router.get("/", notificationController.getNotifications);

// Obeležavanje notifikacije kao pročitane
router.put("/:id/mark-read", notificationController.markAsRead);

module.exports = router;
