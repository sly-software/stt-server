const express = require('express');
const router = express.Router();
const pool = require('../db/db.js');

// accessing items prop of this payload req.body[0].items
const fromCart = [   
    {   
        id:  "yfkbAKUUDBKJBkjuu783hk8qy",
        items: [
            {
                "customer_id": 2,
                "product_id": "B7024S",
                "quantity": 7,
                "value": 2456285.2
            },
            {
                "customer_id": 2,
                "product_id": "N0551S",
                "quantity": 8,
                "value": 2807183.2
            },
            {
                "customer_id": 2,
                "product_id": "0030078500",
                "quantity": 89,
                "value": 31229914
            }
        ]   
    },
];


/// MIDDLEWARE
router.param('cartId', async (req, res, next, cartId) => {
    try {
        let cartRecords = await pool.query("SELECT * FROM cart");

        const items = cartRecords.rows.filter(item => item.id === cartId);
        // res.send(items);
    
        if (items.length) {
            req.cartIsValid = true;
            next();
        } else {
            req.cartIsValid = false;
            next();
        }
    } catch (error) {
        next();
    }
});


/// ROUTERS 
// Make a new order (Checkout)
router.post('/:cartId', async (req, res) => {

    if (req.cartIsValid) {
        // console.log(fromCart[0].items);

        fromCart[0].items.map(async (item) => {
            try {
                const { customer_id, product_id, quantity } = item;      
                const newItem = await pool.query("INSERT INTO orders (customer_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *", [customer_id, product_id, quantity]);
                // console.log(newItem.rows[0]);

            } catch (error) {
                console.error(error.message);
            }
        });
   
        res.status(202).json("New Order created");

    } else {
        res.status(400).send("Woops! something is wrong");
    };

});


// Get all the orders from db
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
                                        "SELECT customer_id, product_id, manufacture, name, description, price, quantity, in_stock \
                                        FROM orders, products \
                                        WHERE orders.product_id = products.manufacture_code \
                                        ORDER BY customer_id ASC"
        );

        res.status(202).json(result.rows);


    } catch (error) {
        console.error(error.message);
    }
});




module.exports = router;
