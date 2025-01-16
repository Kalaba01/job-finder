// Set the language for the response based on a cookie
const languageMiddleware = (req, res, next) => {
  const lang = req.cookies.lang || "en";
  if (["en", "bs"].includes(lang)) {
    res.setLocale(lang);
  }
  next();
};

module.exports = languageMiddleware;
