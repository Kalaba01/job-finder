const express = require("express");
const imageController = require("../controllers/imageController");
const router = express.Router();
const { authMiddleware } = require("../middleware");

// Endpoint za prikazivanje slike na osnovu ID-a
router.get("/:id", imageController.getImageById, authMiddleware.isAuthenticated);

module.exports = router;
