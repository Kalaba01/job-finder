require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { i18n, initDatabase, passport, sessionConfig } = require("./config");
const { languageMiddleware, userRedirectMiddleware, authMiddleware, notFoundMiddleware } = require("./middleware");
const { adminRoutes, authRoutes, candidateRoutes, firmRoutes, languageRoutes, passwordResetRoutes, imageRoutes, fileRoutes, ticketRoutes } = require("./routes");

const app = express();

app.use(sessionConfig);

// Middleware
app.use(express.urlencoded({ extended: true }));
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
app.use("/password", passwordResetRoutes);
app.use("/images", imageRoutes);
app.use("/files", fileRoutes);
app.use("/tickets", ticketRoutes);

// User routes
app.use("/admin", adminRoutes);
app.use("/firm", firmRoutes);
app.use("/candidate", candidateRoutes);

// Route for language change
app.use("/", languageRoutes);

// Glavna ruta
app.get("/", authMiddleware.redirectAuthenticatedUser, (req, res) => {
  res.render("index", { locale: req.getLocale() });
});

// Middleware za 404 greške
app.use(notFoundMiddleware);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
