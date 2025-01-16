const express = require("express");
const passwordResetController = require("../controllers/passwordResetController");
const router = express.Router();

// Routes for handling password resets
router.get("/reset-password", passwordResetController.showResetPasswordForm);
router.post("/request", passwordResetController.requestPasswordReset);
router.post("/reset-password", passwordResetController.handlePasswordReset);

module.exports = router;
