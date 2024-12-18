const authMiddleware = require("./authMiddleware");
const authValidation = require("./authValidation");
const languageMiddleware = require("./languageMiddleware");
const userRedirectMiddleware = require("./userRedirectMiddleware");
const notFoundMiddleware = require("./notFoundMiddleware");
const setMenuOptions = require("./setMenuOptions");
const uploadMiddleware = require("./uploadMiddleware");

module.exports = {
    authMiddleware,
    authValidation,
    languageMiddleware,
    userRedirectMiddleware,
    notFoundMiddleware,
    setMenuOptions,
    uploadMiddleware
}
