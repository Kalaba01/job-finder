require('dotenv').config();
const express = require('express');
const db = require('./config/database');

const app = express();

// Middleware
app.use(express.json());


// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
