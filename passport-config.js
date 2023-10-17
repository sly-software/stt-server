const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email);

        if(user === null) {
            return done(null, false, { message: "No User with that email" })
        }
        if(user.password != password) {
            return done(null, false, { message: "password incorrect" })
        }

        return done(null, user); 
    }

    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser))

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { return done(null, getUserById(id)); })
};



module.exports = initialize;