const express = require('express');
const server = express();
const PORT = process.env.PORT || 4000;
const products = require('./routes/products.js');
const customers  = require('./routes/customers.js');
const cart = require('./routes/cart.js');
const orders = require('./routes/orders.js');


/************ MIDDLEWARES ***********************/
server.use(express.json());   // parse incoming POST/PUT req.body as JSON


/************ ROUTES ***************************/
// Products end point
server.use('/products', products);
// User End-point
server.use('/customers', customers);
// Cart endpints
server.use('/cart', cart);
// Orders  End-point
server.use('/orders', orders);


/******* SERVER LISTENING ********/
server.listen((PORT), () => {
    console.log(`Server started on PORT: ${PORT}`);
    console.log('Visit web at http://localhost:' + PORT);
});
