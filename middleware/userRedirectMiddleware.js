module.exports = (req, res, next) => {
  const userType = req.user?.type;

  if (userType === "admin") {
    res.locals.homeUrl = "/admin";
  } else if (userType === "firm") {
    res.locals.homeUrl = "/firm";
  } else if (userType === "candidate") {
    res.locals.homeUrl = "/candidate";
  } else {
    res.locals.homeUrl = "/";
  }
  next();
};
