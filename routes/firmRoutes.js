const express = require('express');
const router = express.Router();

// Firm Dashboard
router.get('/', (req, res) => {
  res.render('firm');
});

module.exports = router;
