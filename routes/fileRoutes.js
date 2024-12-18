const express = require("express");
const fileController = require("../controllers/fileController");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// Ruta za preuzimanje fajla kandidata (CV, motivaciono pismo, preporuke)
router.get("/:type/:candidateId", authMiddleware.isAuthenticated, fileController.getCandidateFile);

module.exports = router;
