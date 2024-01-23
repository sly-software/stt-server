// Import Local stratergy for authorization
const LocalStrategy = require("passport-local").Strategy;
const { comparePasswords } = require("./model/index");

// Initialize passport lib and user verification btn
// user submitted data and database records then serialize user session
function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try {
      var user = getUserByEmail(email);
      const passwordMatch = await comparePasswords(password, user.password);
      if (user === null)
        return done(null, false, { message: "No User with that email" });
      if (!passwordMatch)
        return done(null, false, { message: "password incorrect" });
    } catch (err) {
      console.error(err.message);
    }
    return done(null, user);
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.serializeUser(function (user, done) {
    process.nextTick(function () {
      done(null, user.id);
    });
  }); 

  passport.deserializeUser(function (id, done) {
    process.nextTick(function () {
      // console.log(getUserById(id))
      done(null, getUserById(id));
    });
  });
}

module.exports = initialize;
