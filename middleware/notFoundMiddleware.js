module.exports = (req, res, next) => {
  res.status(404).render("404", { locale: req.getLocale() });
};
