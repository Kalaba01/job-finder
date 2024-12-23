const { adminRoutes, authRoutes, candidateRoutes, firmRoutes, languageRoutes, passwordResetRoutes, imageRoutes, fileRoutes, ticketRoutes } = require("../routes");

const configureRoutes = (app) => {
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
};

module.exports = configureRoutes;
