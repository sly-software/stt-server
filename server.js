const express = require('express');
const server = express();
const PORT = process.env.PORT || 4000;


/************ MIDDLEWARES ***********************/



/************ ROUTES ***************************/
















/******* SERVER LISTENING ********/
server.listen((PORT), () => {
    console.log(`Server started on PORT: ${PORT}`);
    console.log('Visit web at http://localhost:' + PORT);
});
