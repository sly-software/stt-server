const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.DB_USER,
    password: process.DB_PASSWORD,
    database: process.DB_NAME,
    port: process.DB_PORT
});


module.exports = pool;

