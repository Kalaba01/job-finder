const express = require("express");
const imageController = require("../controllers/imageController");
const router = express.Router();

// Endpoint za prikazivanje slike na osnovu ID-a
router.get("/:id", imageController.getImageById);

module.exports = router;
