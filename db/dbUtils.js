const pool = require("./db");
const bcrypt = require('bcrypt');
let users = [];


// Users table
const currentUsers = async () => {
  const response = await pool.query("SELECT * FROM customers");
  users = response.rows

  return users;
};


const addNewUser = async ({ name, email, phone, address, password }) => {
  try {
    // Generate hashed password
    const hashedPassword = await passwordHash(password, 10);
    const response = await pool.query("INSERT INTO customers (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, email, phone, address, hashedPassword]);
    return response.rows
    
  } catch (error) {
    console.error(error.message);
  }
};


// Products table
const getAllProducts = async () => {
  try {
    const response = await pool.query("SELECT * FROM products");
    return response.rows;
  } catch (error) {
    console.error(error.message);
    return []
  }
};


// Given an email get a user
const getUserByEmail = (email) => users.find(user => user.email === email);


// Given and ID get a user
const getUserById = (id) => users.find(user => user.id === id);


// Password hashing
async function passwordHash (password, saltRounds) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;

  } catch (error) {
    console.error(error.message)
  }

  return null;
};


// Compare hashed passcodes
async function comparePasswords (password, hash) {
  try {
    const matchFound = await bcrypt.compare(password, hash);
    return matchFound;

  } catch (err) {
    console.error(err.message);
  }

  return false;
};





module.exports = {
    currentUsers,
    getAllProducts,
    addNewUser,
    getUserByEmail,
    getUserById,
    passwordHash,
    users,
    comparePasswords
};
