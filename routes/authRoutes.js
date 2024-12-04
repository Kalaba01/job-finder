const express = require('express');
const authController = require('../controllers/authController');
const { validateCandidateRegistration, validateLogin } = require("../middleware/authValidation");

const router = express.Router();

// Route for candidate registration
router.post('/register/candidate', validateCandidateRegistration, authController.registerCandidate);

// Route for login
router.post("/login", validateLogin, authController.login);

module.exports = router;
