// Import Local stratergy for authorization
const LocalStrategy = require('passport-local').Strategy;
const { comparePasswords } = require('./db/dbUtils')


// Initialize passport lib and user verification btn 
// user submitted data and database records then serialize user session
function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        const passwordMatch = await comparePasswords(password, user.password);

        try{
            if(user === null) return done(null, false, { message: "No User with that email" });
            if(!passwordMatch) return done(null, false, { message: "password incorrect" });
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
