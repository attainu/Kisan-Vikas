const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const cors = require("cors")
const multer = require("multer")
dotenv.config();
require("./db");
require("./passport");

//routes of both api as well as normal
// const userRoutes = require("./routes/userRoutes");

//init
const app = express();
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:1234",
        credentials: true,
        allowedHeaders: ["Content-Type,Authorization"]
    })
);
app.use(express.json());
app.use(passport.initialize());
app.use(fileupload());

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
//review
app.use(require("./routes/reviewRoutes"))


app.listen(3000,function(){
    console.log("Server started")
});