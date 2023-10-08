const express = require('express');
const server = express();
const pool = require("./db/db.js");
const PORT = process.env.PORT || 4000;


/************ MIDDLEWARES ***********************/
server.use(express.json());   // parse incoming POST/PUT req.body as JSON
server.use('/products/:code', async (req, res, next) => {
    // console.log('Request Type: ', req.method);
    const { code } = req.params;
    let products = await pool.query("SELECT * FROM products");

    // Search id if exist in db
    result = products.rows.filter(product => product.manufacture_code === code);

    if (result.length !== 0) {
        req.product_id = result[0]["manufacture_code"];
        // console.log(req.product_id)
        next();
    } else {
        next()
    }
});



/************ ROUTES ***************************/
// Get all products from database
server.get('/products', async (req, res) => {
    try {

        // Query the db async
        const products = await pool.query("SELECT * FROM products");
        res.json(products.rows);

    } catch (error) {
        
        console.error(error.message);
        res.status(500).send("There must be an error! please retry later.");
    }
});


// Add a product into db
server.post('/products', async (req, res) => {
    try {
        const { manufacture_code, manufacture, name, description, price, in_stock } = req.body;
        // const newProduct = req.body;

        // Querrying database to add new product
        if (name && description && price && manufacture && manufacture_code && in_stock !== false) {
            const addNew = await pool.query(
                "INSERT INTO products (manufacture_code, manufacture, name, description, price, in_stock) VALUES ($1, $2, $3, $4, $5, $6)",
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
server.put('/products/:code', async (req, res) => {
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
server.delete('/products/:code', async (req, res) => {
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
















/******* SERVER LISTENING ********/
server.listen((PORT), () => {
    console.log(`Server started on PORT: ${PORT}`);
    console.log('Visit web at http://localhost:' + PORT);
});
