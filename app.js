require("dotenv").config();
const express = require("express");
const { configureApp, configureServer } = require("./config/appConfig");
const { initDatabase } = require("./config");
const { authMiddleware, notFoundMiddleware } = require("./middleware");
const { scheduleJobAdExpirationCheck  } = require("./schedulers/jobScheduler");
const configureRoutes = require("./config/routesConfig"); // Routes

// Initialize the Express application
const app = express();

// Configure the application: setup middleware, static files, etc.
configureApp(app);

// Database initialization
initDatabase();

// Configure all application routes
configureRoutes(app);

app.get("/", authMiddleware.redirectAuthenticatedUser, (req, res) => {
  res.render("index", { locale: req.getLocale() });
});

// Middleware for handling 404 errors (page not found)
app.use(notFoundMiddleware);

// Initialize the server and set the listening port
const { server, port } = configureServer(app);

// Start the server and listen on the defined port
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Schedule periodic tasks, such as automatically closing expired job ads
scheduleJobAdExpirationCheck();
