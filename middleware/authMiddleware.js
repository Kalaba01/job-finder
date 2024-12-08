exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).render("403", { locale: req.getLocale() });
};

exports.isFirm = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "firm") {
    return next();
  }
  res.status(403).render("403", { locale: req.getLocale() });
};

exports.isCandidate = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "candidate") {
    return next();
  }
  res.status(403).render("403", { locale: req.getLocale() });
};
