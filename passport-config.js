const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email);

        try{
            if(user === null) return done(null, false, { message: "No User with that email" });
            if(user.password != password) return done(null, false, { message: "password incorrect" });
        } catch (err) {
            console.error(err.message);
        }
        return done(null, user); 
    }

    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
};


module.exports = initialize;
