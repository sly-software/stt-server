const expres = require('express');
const router = expres.Router();
const pool = require('../db/db.js');
 


// MIDDLEWARES 
router.param('id', async (req, res, next, id) => {
    try {
        let customers = await pool.query("SELECT * FROM customers");
        const codeInDb = customers.rows.find(customer => customer.id === Number(id)).id;
    
        if (codeInDb) {
            req.customer_id = codeInDb;
            next();
        } else {
            next();
        }
    } catch (error) {
        next()
    }

});


// ROUTES 
// Get all customers 
router.get('/', async (req, res) => {
    try {
        const results = await pool.query("SELECT * FROM customers");
        const customers = results.rows;

        res.json(customers);

    } catch (error) {
        console.error(error.message);
    }
});


// Register a new customer 
router.post('/register', async (req, res) => {


    console.error(error.message);
    res.status(400).send("Error: 400\n Double check your details its either your duplicating information or some data are missing from your submission")
});




// Get a specific customer 
router.get('/:id', async (req, res) => {
    try {

        if(req.customer_id) {
            const results = await pool.query("SELECT * FROM customers WHERE customers.id = $1", [req.customer_id]);
            const specificUser = results.rows[0];
            res.status(200).json(specificUser);
        } else {
            res.status(404).send("Something is wrong please try again with correct paramaters")
        }


    } catch (error) {
        res.sendStatus(500);
        console.error(error.message);
    }
});


module.exports = router;
