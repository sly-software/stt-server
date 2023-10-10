const express = require('express');
const router = express.Router();
const pool = require("../db/db.js");



// MIDDLEWARES 
router.param('code', async (req, res, next, code) => {
    try {
        let products = await pool.query("SELECT * FROM products");
        const codeInDb = products.rows.find(product => product.manufacture_code === code).manufacture_code;
    
        if (codeInDb) {
            req.product_id = codeInDb;
            next();
        } else {
            next();
        }
    } catch (error) {
        next();
    }
});



// Get cart content 
router.get('/', async (req, res) => {
    try {
        const content = await pool.query("SELECT * FROM cart");
        const result = content.rows;

        res.status(200).json(result);


    } catch (error) {
        console.error(error.message);
    }
});


// Insert a specific item into cart
router.post('/', async (req, res) => {
    try {
        const { id, customer_id, product_id, quantity, value } = req.body;
        const newItem = await pool.query("INSERT INTO cart (id, customer_id, product_id, quantity, value) VALUES ($1, $2, $3, $4, $5) RETURNING *", [id, customer_id, product_id, quantity, value]);
        
        res.status(202).json(newItem.rows[0]);
    
    } catch (error) {
        res.status(400).send("Woops!! there must be an error");
        console.error(error.message);
    }
})


// Delete an item from cart
router.delete('/:code', async (req, res) => {
    try {
        await pool.query("DELETE FROM cart WHERE product_id = $1", [req.product_id]);

        res.status(202).json("Success")

    } catch (error) {
        res.send("Something is wrong please try again");

        console.error(error.message);
    }
})



module.exports = router;
