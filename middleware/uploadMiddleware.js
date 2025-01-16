const multer = require("multer");
const upload = multer();

// Handle file uploads for specific fields
const uploadMiddleware = upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "motivation_letter", maxCount: 1 },
  { name: "recommendations", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
  { name: "attachment", maxCount: 1 }
]);

module.exports = uploadMiddleware;
