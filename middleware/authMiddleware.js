// Check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

// Redirect authenticated users to their home page
exports.redirectAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === "admin") {
      return res.redirect("/admin");
    } else if (req.user.role === "firm") {
      return res.redirect("/firm");
    } else if (req.user.role === "candidate") {
      return res.redirect("/candidate");
    }
  }
  next();
};

// Restrict access to admin-only routes
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).render("shared/403", { locale: req.getLocale() });
};

// Restrict access to firm-only routes
exports.isFirm = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "firm") {
    return next();
  }
  res.status(403).render("shared/403", { locale: req.getLocale() });
};

// Restrict access to candidate-only routes
exports.isCandidate = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "candidate") {
    return next();
  }
  res.status(403).render("shared/403", { locale: req.getLocale() });
};
