const express = require("express");
const imageController = require("../controllers/imageController");
const router = express.Router();
const { authMiddleware } = require("../middleware");

// Route for serving images
router.get("/:id", imageController.getImageById, authMiddleware.isAuthenticated);

module.exports = router;
