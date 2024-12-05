const express = require('express');
const authController = require('../controllers/authController');
const { validateCandidateRegistration, validateFirmRequest, validateLogin } = require("../middleware/authValidation");

const router = express.Router();

// Route for candidate registration
router.post('/register/candidate', validateCandidateRegistration, authController.registerCandidate);

// Route for firm registration request
router.post('/register/firm', validateFirmRequest, authController.registerFirmRequest);

// Route for login
router.post("/login", validateLogin, authController.login);

module.exports = router;
