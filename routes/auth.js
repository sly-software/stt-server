require('dotenv').config()
const express = require('express');
const router = express.Router();


const initializePassport = require('../passport-config');
const passport = require('passport');
const { users } = require('../db/dbUtils');

initializePassport(
    passport, 
    (email) => users.find(user => user.email === email),
    (id) => users.find(user => user.id === id)
);


// router.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));


// router.use(passport.initialize());
// router.use(passport.session());



router.get('/login', checkNotAuthenticated,  (req, res) => {
    res.render('pages/login');
})


router.get('/register', (req, res) => {
    res.render('pages/register');
})


router.post('/login', passport.authenticate('local', { successRedirect: '/products', failureRedirect: '/auth/login' }))








function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/auth/login')
};


function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/products')
    }

    next()
};


module.exports = router;