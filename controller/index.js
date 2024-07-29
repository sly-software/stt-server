const pool = require("../model/db");
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
  getDBOffers,
  addDBOffer,
  saveDNToDB,
} = require("../model/index");
const path = require("path");
const { GoogleAuthorityCode } = require("../utils/google");

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
    res.send("Successfully loggedout");
  });
}

/**
 *  AUTH: Check if authenticated
 */
function checkAuthenticated(req, res, next) {
  // console.log("is user authenticated: " + req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log("is user authenticated: " + req.isAuthenticated());
    return next();
  }
  console.log("is user authenticated: " + req.isAuthenticated());
  return res.json({ message: "Unauthorized" });
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
    const filename = file.originalname;
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
    await fastUploadDataToDB(
      path.join(__dirname, "uploads", "gsl_updated.csv")
    );
    res.json({ message: "Successfully uploaded files" });
  } catch (error) {
    console.error(error.message);
  }
}

/**
 * Get current_stock logs
 */
const getCurrentStockLogs = async (req, res) => {
  try {
    const logs = await currentStockLogs();
    res.status(201).json(logs);
  } catch (error) {
    res.status(404).send();
    console.error(error);
  }
};

/**
 * Read from uploaded file and update database right away
 */
function readContent() {
  fs.createReadStream(__dirname + "/uploads/gsl_updated.csv")
    .pipe(csvParser())
    .on("data", (data) => {
      setTimeout(async () => {
        await updateCurrentStock(data);
      }, 1);
    })
    .on("end", () => {
      clearScreenDown;
    });
}

/**************************************** */
/**************************************** */
/**************************************** */
/**************************************** */
/**************************************** */
/********** SECTION 04 : START  ********* */

/**
 * GET all current offers
 */
async function getOffers(req, res) {
  try {
    // console.log(req.user)
    // console.log(req.session)
    const offers = await getDBOffers();
    // console.log(offers)
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "No offers at the momment" });
    console.error(error);
  }
}

/**
 * ADD new offer to Offer table
 */
async function addNewOfferToDB(req, res) {
  try {
    const response = await addDBOffer(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "There was an error" });
  }
}

/**************************************** */
/**************************************** */
/**************************************** */
/**************************************** */
/**************************************** */
/********** SECTION 05 GOOGLE API: START  ********* */

function deleteFileInServer(file) {
  const filename = file.originalname;
  fs.unlink(file.path, (err) => {
    if (err) console.log(err);
    console.log(`File with name ${filename} deleted.`);
  });
}

const deleteFileInGDrive = async (req) => {
  const g = new GoogleAuthorityCode();
  await g.deleteFileInGDrive(req.id);
};

const getAllFilesInGD = async () => {
  const g = new GoogleAuthorityCode();
  const files = await g.getAllFilesInGD();
  return files;
};

//Upload function to DB
const uploadDNmetada = async (req) => {
  const uploadToGoogleDrive = new GoogleAuthorityCode();

  const googleDriveServices = await uploadToGoogleDrive.getResultDataObject(
    req.files[0]
  );

  const saveToDB = await saveDNToDB(googleDriveServices);

  return saveToDB.rows[0];
};

/**********  SECTION 05 : END   ********* */
/**************************************** */
/**************************************** */
/**************************************** */
/**************************************** */

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
  getOffers,
  addNewOfferToDB,
  deleteFileInServer,
  uploadDNmetada,
  getAllFilesInGD,
  deleteFileInGDrive,
};
