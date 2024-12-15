const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");

exports.authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

exports.login = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return reject(err);
      }

      if (!user) {
        return reject(new Error(info.message));
      }

      req.logIn(user, (err) => {
        if (err) {
          return reject(err);
        }

        let redirectUrl;
        switch (user.role) {
          case "admin":
            redirectUrl = "/admin/";
            break;
          case "firm":
            redirectUrl = "/firm/";
            break;
          case "candidate":
            redirectUrl = "/candidate/";
            break;
          default:
            redirectUrl = "/";
        }

        resolve({ redirectUrl });
      });
    })(req, res, next);
  });
};
