const multer = require("multer");
const fs = require("fs");
const csvParser = require("csv-parser");
const { clearScreenDown } = require("readline");
const {
  getCurrentStock,
  updateCurrentStock,
  addNewUser,
  users,
  currentUsers,
  truncateTable,
  fastUploadDataToDB,
  currentStockLogs,
} = require("../model/index");
const path = require("path");

/**
 *  AUTH: Render registration form
 */
function registrationForm(req, res) {
  res.render("pages/register");
}

/**
 *  AUTH: Send registration form
 */
async function sendRegistrationForm(req, res, next) {
  const newUser = await addNewUser(req.body);

  if (newUser) {
    res.redirect("/api/login");
  } else {
    res.redirect("/api/register");
  }
} 

/**
 *  AUTH: Render login page
 */
function loginPage(req, res) {
  res.render("pages/login");
}

/**
 *  AUTH: Logout user
 */
function logoutUser(req, res, next) {
  req.logOut((err) => {
    if (err) return next(err);
    res.redirect("/api/login");
    res.send();
  });
}

/**
 *  AUTH: Check if authenticated
 */
function checkAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/login");
}

/**
 *  AUTH: Check if not authenticated
 */
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

/**
 * Populate user's array with data from DB
 */
async function getAllUsers(req, res, next) {
  await currentUsers();
  if (users) return next();
  res.status(500).json({ msg: "Fatal error encountered" });
}

/**
 * MULTER
 */
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    const filename = "gsl_updated.csv";
    callback(null, filename);
  },
});

/**
 * Multer configuration object
 */
const upload = multer({ storage: storage });

/**
 * Read data from database and send them through res object
 */
async function fetchData(req, res) {
  const results = await getCurrentStock();
  if (results.length === 0) {
    res.json({ message: "No data" });
    return;
  }
  return res.json(results);
}

/**
 * Collect file uploaded from frontend and read its content then save them
 * to this server folder
 */
async function uploadFiles(req, res) {
  // readContent(); // Add new records in there.
  // fastUploadDataToDB(__dirname + "\\uploads\\gsl_updated.csv");

  try {
    truncateTable(); // delete everything in the DB first 
    await fastUploadDataToDB(path.join(__dirname,"uploads", "gsl_updated.csv")); 
    res.json({ message: "Successfully uploaded files" });
  } catch (error) {
    console.error(error.message)
  }
}

/**
 * Get current_stock logs
 */
const getCurrentStockLogs = async (req, res) => {
  try {
    const logs = await currentStockLogs();
    res.status(201).json(logs)
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
}

/**
 * Read from uploaded file and update database right away
 */
function readContent() {
  fs.createReadStream(__dirname + "/uploads/gsl_updated.csv")
    .pipe(csvParser())
    .on("data", (data) => {
      setTimeout(async()=>{await updateCurrentStock(data)}, 1)
    })
    .on("end", () => {
      clearScreenDown;
    });
}

module.exports = {
  uploadFiles,
  fetchData,
  upload,
  registrationForm,
  sendRegistrationForm,
  loginPage,
  logoutUser,
  checkAuthenticated,
  checkNotAuthenticated,
  getAllUsers,
  getCurrentStockLogs,
};
