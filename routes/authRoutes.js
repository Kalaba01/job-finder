const express = require('express');
const authController = require('../controllers/authController');
const { authValidation } = require("../middleware");
const router = express.Router();

// Registration routes
router.post('/register/candidate', authValidation.validateCandidateRegistration, authController.registerCandidate);
router.post('/register/firm', authValidation.validateFirmRequest, authController.registerFirmRequest);

// Login route
router.post("/login", authValidation.validateLogin, authController.login);

// Logout route
router.post("/logout", authController.logout);

module.exports = router;
