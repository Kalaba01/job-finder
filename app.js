require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const i18n = require("./config/i18nConfig");
const initDatabase = require("./config/initDatabase");
const sessionConfig = require("./config/sessionConfig");
const passport = require("./config/passport");
const { languageMiddleware, userRedirectMiddleware } = require("./middleware");
const { adminRoutes, authRoutes, candidateRoutes, firmRoutes, languageRoutes } = require("./routes");

const app = express();

app.use(sessionConfig);

// Middleware
app.use(express.json());
app.use(i18n.init);
app.use(cookieParser());

// Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use("/locales", express.static(path.join(__dirname, "config/locales")));

// Middleware for reading language from cookie
app.use(languageMiddleware);

// Middleware for link redirections
app.use(userRedirectMiddleware);

// Setting EJS as view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Database initialization
initDatabase();

app.use("/auth", authRoutes);

// User routes
app.use("/admin", adminRoutes);
app.use("/firm", firmRoutes);
app.use("/candidate", candidateRoutes);

// Route for language change
app.use("/", languageRoutes);

// Glavna ruta
app.get("/", (req, res) => {
  res.render("index", { locale: req.getLocale() });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
