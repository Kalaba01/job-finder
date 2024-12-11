exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

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
