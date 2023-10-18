require('dotenv').config()
const express = require('express');
const server = express();
const PORT = process.env.PORT || 4001;


const auth = require('./routes/auth.js');



/************ MIDDLEWARES ***********************/
server.use(express.json());   // parse incoming POST/PUT req.body as JSON
server.use(express.urlencoded({ extended: false }));
server.set("view engine", "ejs");
server.set("views", "views");
server.use(express.static('public'));


/************ ROUTES ***************************/
server.use('/api', auth);


/******* SERVER LISTENING ********/
server.listen((PORT), () => {
    console.log(`Server started on PORT: ${PORT}`);
    console.log('Visit web at http://localhost/api:' + PORT);
});
