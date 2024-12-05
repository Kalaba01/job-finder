const express = require('express');
const router = express.Router();

// Candidate Dashboard
router.get('/', (req, res) => {
  res.render('candidate');
});

module.exports = router;
