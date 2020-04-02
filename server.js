const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors")
dotenv.config();
require("./db");
require("./passport");

//routes of both api as well as normal
const userRoutes = require("./routes/userRoutes");

//init
const app = express();
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:1234",
        credentials: true,
        allowedHeaders: ["Content-Type"]
    })
);
app.use(express.json());
app.use(passport.initialize());

// user Routes
app.use(require("./routes/userRoutes"));
// User Address Routes
app.use(require("./routes/addressRoutes"));
//product Routes
app.use(require("./routes/productRoutes"));
//cart Routes
app.use(require("./routes/cartRoutes"));
//order Routes
app.use(require("./routes/orderRoutes"));


app.listen(3000,function(){
    console.log("Server started")
});