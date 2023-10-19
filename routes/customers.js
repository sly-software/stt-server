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
