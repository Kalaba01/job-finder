// Handle 404 errors and render a "Not Found" page
module.exports = (req, res, next) => {
  res.status(404).render("shared/404", { locale: req.getLocale() });
};
