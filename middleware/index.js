const authMiddleware = require("./authMiddleware");
const authValidation = require("./authValidation");
const languageMiddleware = require("./languageMiddleware");
const userRedirectMiddleware = require("./userRedirectMiddleware");
const notFoundMiddleware = require("./notFoundMiddleware");
const setMenuOptions = require("./setMenuOptions");
const uploadMiddleware = require("./uploadMiddleware");
const firmApplicationAccessMiddleware = require("./firmApplicationAccessMiddleware");
const firmHiringProcessAccessMiddleware = require("./firmHiringProcessAccessMiddleware");

module.exports = {
    authMiddleware,
    authValidation,
    languageMiddleware,
    userRedirectMiddleware,
    notFoundMiddleware,
    setMenuOptions,
    uploadMiddleware,
    firmApplicationAccessMiddleware,
    firmHiringProcessAccessMiddleware
}
