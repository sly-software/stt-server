const pool = require("./db");
const bcrypt = require("bcrypt");
let users = [];

/**
 * USER: get all saved users
 */
const currentUsers = async () => {
  const response = await pool.query("SELECT * FROM customers");
  users = response.rows;
  return users;
};

/**
 * USER: add new user in the database table
 */
const addNewUser = async ({ name, email, phone, address, password }) => {
  try {
    // Generate hashed password
    const hashedPassword = await passwordHash(password, 11);
    const response = await pool.query(
      "INSERT INTO customers (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, phone, address, hashedPassword]
    );
    return response.rows;
  } catch (error) {
    console.error(error.message);
  }
};

/**
 * CURRENT_STOCK: get all products
 */
const getCurrentStock = async () => {
  const response = await pool.query("SELECT * FROM current_stock");
  const data = response.rows;
  return data;
};

/**
 * CURRENT_STOCK: update/add products informations to the DB
 */
const updateCurrentStock = async ({
  product_code,
  product_description,
  qty_instock,
  store_location,
  box_number,
}) => {
  // Select this product from tha db
  // If available update its details
  // If not available then add it as a new product
  let response = await pool.query(
    "SELECT * FROM current_stock WHERE product_code = $1",
    [product_code]
  );
  response = response.rows;

  // Either add as a new product
  if (response.length === 0) {
    await addToCurrentProductsDb({
      product_code,
      product_description,
      qty_instock,
      store_location,
      box_number,
    });
  } else {
    // Or update the current information with new data
    await updateCurrentProductsDb({
      qty_instock,
      store_location,
      box_number,
      product_code,
    });
  }
};

/**
 * CURRENT_STOCK: utils to updateCurrentStock
 */
const updateCurrentProductsDb = async ({
  qty_instock,
  store_location,
  box_number,
  product_code,
}) => {
  await pool.query(
    "UPDATE current_stock SET qty_instock = $1, store_location = $2, box_number = $3 WHERE product_code = $4",
    [qty_instock, store_location, box_number, product_code]
  );
};

/**
 * CURRENT_STOCK: utils to updateCurrentStock
 */
const addToCurrentProductsDb = async ({
  product_code,
  product_description,
  qty_instock,
  store_location,
  box_number,
}) => {
  // ADD NEW PRODUCT
  await pool.query(
    `INSERT INTO current_stock (
        product_code,
        product_description,
        qty_instock,
        store_location,
        box_number
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        )
      `,
    [product_code, product_description, qty_instock, store_location, box_number]
  );
};

/**
 * CURRENT_STOCK: utils to updateCurrentStock
 */
const truncateTable = async () => {
  await pool.query("TRUNCATE TABLE current_stock")
}

/**
 * CURRENT_STOCK: Fast write to DB
 */
const fastUploadDataToDB = async (filePath) => {
  // console.log(filePath);
  await pool.query(`COPY current_stock FROM '${filePath}' CSV HEADER`);
}

/**
 * CURRENT_STOCK: Get current_stock update logs data
 */
const currentStockLogs = async () => {
  const logs = await pool.query('SELECT * FROM stt_logs');
  return logs.rows[logs.rows.length - 1];
}


/**
 * USER: search user by email
 */
const getUserByEmail = (email) => users.find((user) => user.email === email);

/**
 * USER: search user by id
 */
const getUserById = (id) => users.find((user) => user.id === id);

/**
 * PASSWORD: Hashing password
 */
async function passwordHash(password, saltRounds) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (error) {
    console.error(error.message);
  }
  return null;
}

/**
 * PASSWORD: compare hashed password to user_password
 */
async function comparePasswords(password, hash) {
  try {
    const matchFound = await bcrypt.compare(password, hash);
    return matchFound;
  } catch (err) {
    console.error(err.message);
  }
  return false;
}

module.exports = {
  currentUsers,
  addNewUser,
  getUserByEmail,
  getUserById,
  passwordHash,
  users,
  comparePasswords,
  getCurrentStock,
  updateCurrentStock,
  truncateTable,
  fastUploadDataToDB,
  currentStockLogs,
};
