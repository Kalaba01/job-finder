const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route for candidate registration
router.post('/register/candidate', authController.registerCandidate);

module.exports = router;
