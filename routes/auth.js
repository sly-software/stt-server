require('dotenv').config()
const express = require('express');
const router = express.Router();
const products = require('./products');
const customers = require('./customers');
const cookieParser = require('cookie-parser');

const initializePassport = require('../passport-config');
const passport = require('passport');
const { currentUsers, addNewUser } = require('../db/dbUtils');
const session = require('express-session');
let users = [];


router.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false
}));
router.use(cookieParser());
router.use(passport.initialize());
router.use(passport.session());


initializePassport(passport, (email) => users.find(user => user.email === email), (id) => users.find(user => user.id === id));


// PROTECTED ROUTES
router.use('/login', async (req, res, next) => {
    users = await currentUsers();
    if (users) return next()

    res.status(500).json({ msg: "Fatal error encountered" });
});


router.use('/products', checkAuthenticated,  products);
router.use('/customers', checkAuthenticated,  customers);


router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('pages/login');
});


router.post('/login', checkNotAuthenticated, passport.authenticate('local', { failureRedirect: '/api/login'}), 
    (req, res) => {
        res.redirect('/api/products')
    }
);


router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('pages/register');
});


router.post('/register', async (req, res, next) => {
    const newUser = await addNewUser(req.body);

    if (newUser) {
        res.redirect('/api/login')
    } else {
        res.redirect('/api/register')
    }
});


router.post('/logout', (req, res, next) => {
    req.logOut((err) => {
        if(err) return next(err);
        res.redirect('/api/login')
    });
});


function checkAuthenticated(req, res, next) {
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/api/login')
};


function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/products')
    }

    next()
};


module.exports = router;

