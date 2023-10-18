const pool = require("./db");

const currentUsers = async () => {
  const response = await pool.query("SELECT * FROM customers");
  return response.rows
};


// Products
const getAllProducts = async () => {
  try {
    const response = await pool.query("SELECT * FROM products");
    return response.rows;
  } catch (error) {
    console.error(error.message);
    return []
  }
};


// Users
const addNewUser = async ({ name, email, phone, address, password }) => {
  try {
    const response = await pool.query("INSERT INTO customers (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, email, phone, address, password]);
    return response.rows
    
  } catch (error) {
    console.error(error.message);
  }
};


module.exports = {
    currentUsers,
    getAllProducts,
    addNewUser
};





















// const users = [
//   {
//     id: 1,
//     name: 'Silvester',
//     email: 'silvestaisasi@gmail.com',
//     phone: '0784282092',
//     address: 'Mbezi Beach Bondeni, Kinondoni, Dar es Salaam, Tanzania',
//     password: 'password'
//   },
//   {
//     id: 2,
//     name: 'Ruth Msuya',
//     email: 'ruth.msuya@inqababiotec.africa',
//     phone: '0689578596',
//     address: 'Msewe, Ubungo, Dar es Salaam, Tanzania',
//     password: '12345'
//   },
//   {
//     id: 5,
//     name: 'Silvester Charles',
//     email: 'silvester.isasi@inqababiotec.co.tz',
//     phone: '0784280292',
//     address: 'Dar es Salaam, Sam Nujoma road',
//     password: '123456'
//   },
//   {
//     id: 7,
//     name: 'Silvester Charles',
//     email: 'silvester.isasi@inqababiotec.co.zambia',
//     phone: '0784280292',
//     address: 'Dar es Salaam, Sam Nujoma road',
//     password: 'zambia'
//   }
// ];