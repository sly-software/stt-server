const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4001;
const path = require("path");

const auth = require("./routes/auth.js");

/************ MIDDLEWARES ***********************/

const whitelist = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://stt-hfwz.onrender.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
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
