require("dotenv").config();
const express = require("express");
const { configureApp, configureServer } = require("./config/appConfig");
const { initDatabase } = require("./config");
const { authMiddleware, notFoundMiddleware } = require("./middleware");
const configureRoutes = require("./config/routesConfig"); // Uvoz ruta

// Inicijalizacija aplikacije
const app = express();

// Konfiguracija aplikacije (middleware, statički fajlovi itd.)
configureApp(app);

// Database initialization
initDatabase();

configureRoutes(app);

// Glavna ruta
app.get("/", authMiddleware.redirectAuthenticatedUser, (req, res) => {
  res.render("index", { locale: req.getLocale() });
});

// Middleware za 404 greške
app.use(notFoundMiddleware);

// Server
const { server, port } = configureServer(app);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
