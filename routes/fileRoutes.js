const express = require("express");
const fileController = require("../controllers/fileController");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// File serving route
router.get("/:fileId", authMiddleware.isAuthenticated, fileController.getFile);

module.exports = router;
