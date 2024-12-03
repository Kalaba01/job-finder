require('dotenv').config();
const express = require('express');
const db = require('./config/database');

const app = express();

// Middleware
app.use(express.json());

app.use(express.static('public'));

// Setting EJS as view engine
app.set('view engine', 'ejs');

// Setting views directory for EJS files
app.set('views', './views');

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page', message: 'Welcome to Job Finder!' });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
