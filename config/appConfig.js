const http = require("http");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const sessionMiddleware = require("./sessionConfig");
const { passport, i18n } = require("./index");
const { initializeSocket } = require("../sockets/socketManager");
const { languageMiddleware, userRedirectMiddleware } = require("../middleware");

const configureApp = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(sessionMiddleware);
    app.use(i18n.init);
    app.use(cookieParser());

    // Static files
    app.use(express.static("public"));
    app.use("/node_modules", express.static(path.join(__dirname, "../node_modules")));
    app.use("/locales", express.static("./locales"));
    app.use("/socket.io-client", express.static(path.join(__dirname, "../node_modules/socket.io/client-dist")));
    app.use("/date-fns", express.static(path.join(__dirname, "../node_modules/date-fns")));
    app.use("/notyf", express.static(path.join(__dirname, "../node_modules/notyf")));

    // View engine setup
    app.set("view engine", "ejs");
    app.set("views", "./views");

    // Middlewares
    app.use(languageMiddleware);
    app.use(userRedirectMiddleware);
    app.use(passport.initialize());
    app.use(passport.session());
};

const configureServer = (app) => {
    const server = http.createServer(app);
    initializeSocket(server);
    const port = process.env.PORT || 3000;
    return { server, port };
};

module.exports = { configureApp, configureServer };
