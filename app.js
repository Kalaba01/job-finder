require("dotenv").config();
const express = require("express");
const path = require('path');
const initDatabase = require('./config/initDatabase');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());

app.use(express.static("public"));

app.use('/auth', authRoutes);

// Setting EJS as view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Database initialization
initDatabase();

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    message: "Welcome to Job Finder!",
  });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
