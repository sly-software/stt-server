require('dotenv').config()
const express = require('express');
const server = express();
const PORT = process.env.PORT || 4001;
const products = require('./routes/products.js');
const customers  = require('./routes/customers.js');
const cart = require('./routes/cart.js');
const orders = require('./routes/orders.js');


/************ MIDDLEWARES ***********************/
server.use(express.json());   // parse incoming POST/PUT req.body as JSON


/************ ROUTES ***************************/
server.use('/products', products); // Products end point
server.use('/customers', customers);  // User End-point
server.use('/cart', cart); // Cart end-point
server.use('/orders', orders);  // Orders  End-point



/******* SERVER LISTENING ********/
server.listen((PORT), () => {
    console.log(`Server started on PORT: ${PORT}`);
    console.log('Visit web at http://localhost:' + PORT);
});
