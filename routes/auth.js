const express = require("express");
const router = express.Router();

const initializePassport = require("../passport-config");
const passport = require("passport");
const { getUserByEmail, getUserById } = require("../model/index");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const stockedChemicals = require("./stockedChemicals");
const offers = require("./offers");
const DNservices = require("./deliveryNotes");
const {
  registrationForm,
  sendRegistrationForm,
  loginPage,
  logoutUser,
  checkAuthenticated,
  checkNotAuthenticated,
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
    name: "stt",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: parseInt(process.env.MAX_AGE),
      httpOnly: true,
      sameSite: "none",
      secure: true
    },
  })
);

// Passport.js initialization
router.use(passport.initialize());
// Passport.session middleware
router.use(passport.session());
// Initialize passport.js for the app
initializePassport(passport, getUserByEmail, getUserById);

router.use((req, res, next) => {
  // console.log(`If authenticated req.user will have my details as follows: `);
  // console.log(req.user);
  // console.log(req.session.passport);
  next();
});

router.get("/user", (req, res) => {
  res.json({ user: req.user ? req.user.name : "IBTZ" });
});

// Routes for fetching all chemicals available in stock
router.use("/stocked", stockedChemicals);
// Route for adding a new product
router.use("/newProducts", checkAuthenticated, stockedChemicals);
// Route for getting/adding/updating/deleting offers
router.use("/current", checkAuthenticated, offers);
/********************************************** */
router.use("/delivery", checkAuthenticated, DNservices);
// router.use("/delivery", DNservices);
/********************************************** */
// Route for health check
router.use("/health-check", (req, res) =>
  res.json({ message: "I am healthy" })
);

/**
 * ROUTES
 */
// Authenticate User
router.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {
    console.log(req.user);
    res.json({ name: req.user.name });
  }
);
// Render registration page
router.get("/register", checkNotAuthenticated, registrationForm);
// Register new user
router.post("/register", sendRegistrationForm);
// Logout the current user
router.post("/logout", logoutUser);

module.exports = router;
