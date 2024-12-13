const express = require("express");
const passwordResetController = require("../controllers/passwordResetController");
const router = express.Router();

// Route for showing password reset form
router.get("/reset-password", passwordResetController.showResetPasswordForm);

// Route for processing password reset form
router.post("/reset-password", passwordResetController.handlePasswordReset);

module.exports = router;
