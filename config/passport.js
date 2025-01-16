const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const authService = require("../services/authService");
const userService = require("../services/userService");

// Configure Passport to use the local authentication strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await authService.authenticateUser(email, password);

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize the user ID into the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only the user's ID in the session
});

// Deserialize the user object from the session using the stored ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
