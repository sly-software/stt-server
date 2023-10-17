require('dotenv').config()
const express = require('express');
const server = express();
const PORT = process.env.PORT || 4001;
const products = require('./routes/products.js');
const customers  = require('./routes/customers.js');
const cart = require('./routes/cart.js');
const orders = require('./routes/orders.js');

const auth = require('./routes/auth.js');
const passport = require('passport');
const session = require('express-session');

server.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 10 }
}));


server.use(passport.initialize());
server.use(passport.session());


/************ MIDDLEWARES ***********************/
server.use(express.json());   // parse incoming POST/PUT req.body as JSON
server.use(express.urlencoded({ extended: false }));
server.set("view engine", "ejs");
server.set("views", "views");
server.use(express.static('public'));


/************ ROUTES ***************************/
server.use('/products', passport.authenticate('session') ,products); // Products end point
server.use('/customers', customers);  // User End-point
server.use('/cart', cart); // Cart end-point
server.use('/orders', orders);  // Orders  End-point

server.use('/auth', auth);









/******* SERVER LISTENING ********/
server.listen((PORT), () => {
    console.log(`Server started on PORT: ${PORT}`);
    console.log('Visit web at http://localhost:' + PORT);
});
