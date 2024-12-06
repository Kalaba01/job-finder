require("dotenv").config();
const express = require("express");
const path = require('path');
const initDatabase = require("./config/initDatabase");
const cookieParser = require("cookie-parser");
const i18n = require("./config/i18nConfig");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const firmRoutes = require("./routes/firmRoutes");
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(i18n.init);
app.use(cookieParser());

app.use(express.static("public"));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use('/locales', express.static(path.join(__dirname, 'config/locales')));

// Middleware for reading language from cookie
app.use((req, res, next) => {
  const lang = req.cookies.lang || "en";
  if (["en", "bs"].includes(lang)) {
    res.setLocale(lang);
  }
  next();
});


// Setting EJS as view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Database initialization
initDatabase();

app.use("/auth", authRoutes);

// User routes
app.use("/admin", adminRoutes);
app.use("/firm", firmRoutes);
app.use('/candidate', candidateRoutes);

// Route for language change
app.get("/set-language/:lang", (req, res) => {
  const lang = req.params.lang;
  if (["en", "bs"].includes(lang)) {
    res.cookie("lang", lang, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid language selected" });
  }
});

// Glavna ruta
app.get("/", (req, res) => {
  res.render("index", { locale: req.getLocale() });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
