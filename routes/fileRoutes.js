const express = require("express");
const fileController = require("../controllers/fileController");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// Ruta za preuzimanje fajla kandidata (CV, motivaciono pismo, preporuke)
router.get("/candidate/:type/:candidateId", authMiddleware.isAuthenticated, fileController.getCandidateFile);

// Ruta za preuzimanje attachmenta iz tabele File
router.get("/ticket/:fileId", authMiddleware.isAuthenticated, fileController.getTicketAttachment);

module.exports = router;
