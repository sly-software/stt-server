const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4001;
const path = require("path");

const auth = require("./routes/auth.js");

/************ MIDDLEWARES ***********************/


app.use(cors({
  origin: "*"
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
app.use(express.json()); // parse incoming POST/PUT req.body as JSON
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(__dirname + "/public"));

/************ ROUTES ***************************/
app.options("*", cors());
app.use("/api", auth);

/******* app LISTENING ********/
app.listen(PORT, () => {
  console.log(`App started on PORT: ${PORT}`);
});
