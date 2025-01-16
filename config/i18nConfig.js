const path = require("path");
const i18n = require("i18n");

// Configure the i18n library
i18n.configure({
  locales: ["en", "bs"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  objectNotation: true,
  cookie: "lang",
});

module.exports = i18n;
