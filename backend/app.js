// ----- SERVER BACKEND -----
const express = require("express");
const app = express();
const port = 8888;
const path = require("path");

// set up body parser
bodyParser = require('body-parser');
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// set up morgan logger
const logger = require("morgan");
app.use(logger("dev"));

// allow CORS
const cors = require("cors");
app.use(cors());

// load .env file into process.env object
require("dotenv").config();

// connect to database
global.conn = require("./database/connection");
conn.connect(err => {
	if (err) throw err;
	console.log(`Connected to ${process.env.DATABASE}`);
});

// start listening
app.listen(port, () => {
    console.log("Listening On Port " + port);
});

// define full path of public folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use("/customers", require("./routes/customers"));
app.use("/employees", require("./routes/employees"));
app.use("/categories", require("./routes/categories"));
app.use("/suppliers", require("./routes/suppliers"));
app.use("/products", require("./routes/products"));
app.use("/shippers", require("./routes/shippers"));
app.use("/orders", require("./routes/orders"));