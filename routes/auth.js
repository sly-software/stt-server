require("dotenv").config();
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const initializePassport = require("../passport-config");
const passport = require("passport");
const { getUserByEmail, getUserById } = require("../model/index");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const stockedChemicals = require("./stockedChemicals");
const {
  registrationForm,
  sendRegistrationForm,
  loginPage,
  logoutUser,
  checkAuthenticated,
  checkNotAuthenticated,
  getAllUsers,
} = require("../controller");
const pool = require("../model/db");

/**
 * MIDDLEWARES
 */
// Session configuration
router.use(
  session({
    store: new pgSession({
      pool: pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5000 },
  })
);
// Cookie perser figuration
router.use(cookieParser());
// Passport.js initialization
router.use(passport.initialize());
// Passport.session middleware
router.use(passport.session());
// Initialize passport.js for the app
initializePassport(passport, getUserByEmail, getUserById);
// Fetch users from on login route requested
router.use("/login", getAllUsers);
// Routes for fetching all chemicals available in stock
router.use("/stocked", stockedChemicals);
// Route for adding a new product
router.use("/newProducts", stockedChemicals);


/**
 * ROUTES
 */
// Render login page
router.get("/login", loginPage);
// Submitt login credentials
router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local"), (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.redirect("http://localhost:5173");
  }
);
// Render registration page
router.get("/register", checkNotAuthenticated, registrationForm);
// Register new user
router.post("/register", sendRegistrationForm);
// Logout the current user
router.post("/logout", logoutUser);

module.exports = router;
