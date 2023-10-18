const express = require('express');
const router = express.Router();
const pool = require("../db/db.js");
const { getAllProducts } = require('../db/dbUtils.js');


/************ MIDDLEWARES  **********************/
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



/************ ROUTES ***************************/
// Get all products from database
router.get('/', async (req, res) => {
    const products = await getAllProducts();
    
    if(products) {
        // res.status(200).json(products);
        return res.render('pages/products', { products: products });
    }

    return res.status(500).json({ msg: "No data found" });
});


// Add a product into db
router.post('/', async (req, res) => {
    try {
        const { manufacture_code, manufacture, name, description, price, in_stock } = req.body;
        // const newProduct = req.body;

        // Querrying database to add new product
        if (name && description && price && manufacture && manufacture_code && in_stock !== false) {
            const newProducts = await pool.query(
                "INSERT INTO products (manufacture_code, manufacture, name, description, price, in_stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [manufacture_code, manufacture, name, description, price, in_stock]
            );
        } else {
            return res.status(400).json("Please make sure all fields are filled in");
        };

        res.status(200).json("New Product record created successfully!");

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Duplicated information not allowed")
    }
});
  

// Update a product details in db
router.put('/:code', async (req, res) => {
    try {
        const { manufacture_code, manufacture, name, description, price, in_stock } = req.body;

        if (req.product_id) {
            await pool.query(
                "UPDATE products SET manufacture_code = $1, manufacture = $2, name = $3, description = $4, price = $5, in_stock = $6 WHERE manufacture_code = $7",
                [manufacture_code, manufacture, name, description, price, in_stock, req.product_id]
            );

            res.status(200).send("Success");
        } else (
            res.status(400).send("Provided ID does not exist")
        )

    } catch (error) {
        res.status(500).send("Duplicate information not allowed");
        console.error(error.message);
    }
});


// Delete a product
router.delete('/:code', async (req, res) => {
    try {
        if (req.product_id) {
            await pool.query(
                "DELETE FROM products WHERE products.manufacture_code = $1",
                [req.product_id]
            );

            res.status(200).send("Success");
        } else (
            res.status(400).send("Item does not exist")
        )

    } catch (error) {
        console.error(error.message);
    }
});


module.exports = router

