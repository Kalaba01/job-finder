const express = require('express');
const authController = require('../controllers/authController');
const { authValidation } = require("../middleware");
const router = express.Router();

// Route for candidate registration
router.post('/register/candidate', authValidation.validateCandidateRegistration, authController.registerCandidate);

// Route for firm registration request
router.post('/register/firm', authValidation.validateFirmRequest, authController.registerFirmRequest);

// Route for login
router.post("/login", authValidation.validateLogin, authController.login);

// Route for logout
router.post("/logout", authController.logout);

module.exports = router;
