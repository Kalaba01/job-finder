const { adminRoutes, authRoutes, candidateRoutes, firmRoutes, languageRoutes, passwordResetRoutes, imageRoutes, fileRoutes, ticketRoutes, notificationRoutes } = require("../routes");

const configureRoutes = (app) => {
    // Authentication routes
    app.use("/auth", authRoutes);
    app.use("/password", passwordResetRoutes);

    // Routes specific to user roles
    app.use("/admin", adminRoutes);
    app.use("/firm", firmRoutes);
    app.use("/candidate", candidateRoutes);
    app.use("/images", imageRoutes);
    app.use("/files", fileRoutes);
    app.use("/tickets", ticketRoutes);
    app.use("/notifications", notificationRoutes)

    // Route for language change
    app.use("/", languageRoutes);
};

module.exports = configureRoutes;
