const authMiddleware = require("./authMiddleware");
const authValidation = require("./authValidation");
const languageMiddleware = require("./languageMiddleware");
const userRedirectMiddleware = require("./userRedirectMiddleware");
const notFoundMiddleware = require("./notFoundMiddleware");

module.exports = {
    authMiddleware,
    authValidation,
    languageMiddleware,
    userRedirectMiddleware,
    notFoundMiddleware
}
