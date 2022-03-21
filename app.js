require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const fileupload = require("express-fileupload");

var blogRouter = require("./routes/blogRouter");
const { default: mongoose } = require("mongoose");

var app = express();

const corsOptions = {
    origin: true,
    credentials: true,
};

// view engine setup
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());
app.use(cors(corsOptions));

mongoose.connect(
    "mongodb+srv://houseofdawah:houseofdawah@cluster0.cgfox.mongodb.net/Blogs?retryWrites=true&w=majority"
);

app.use("/api/blogs", blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
