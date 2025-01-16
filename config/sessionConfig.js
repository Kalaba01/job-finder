require('dotenv').config();
const session = require("express-session");

// Session middleware config
const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
});

module.exports = sessionConfig;
