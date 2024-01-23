require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = parseInt(process.env.PORT) || 4001;
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth.js");
const { getAllUsers } = require("./controller/index.js");

/************ MIDDLEWARES ***********************/
const corsOptions = {
  origin: [process.env.DEV_URL, process.env.PROD_URL],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS' 
}
// Cookie perser figuration
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json()); // parse incoming POST/PUT req.body as JSON
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(__dirname + "/public"));
app.disable("x-powered-by");


/************ ROUTES ***************************/
app.options('/api', cors(corsOptions))
app.use("/api", getAllUsers, auth);



/******* app LISTENING ********/
app.listen(PORT, () => {
  console.log(`App started on PORT: ${PORT}`);
});