require("dotenv").config();
const express = require("express");
const initDatabase = require('./config/initDatabase');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());

app.use(express.static("public"));

// Setting EJS as view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Database initialization
initDatabase();

app.use('/auth', authRoutes);

app.use('/admin', adminRoutes);


// Routes
app.get("/", (req, res) => {
  res.render("index");
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
