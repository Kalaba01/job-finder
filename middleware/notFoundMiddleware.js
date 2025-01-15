module.exports = (req, res, next) => {
  res.status(404).render("shared/404", { locale: req.getLocale() });
};
