var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs=require("express-handlebars")
const db=require("./config/connection")

const fileUpload=require("express-fileupload")
const session=require('express-session')


var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({extname:"hbs",defaultLayout:'layout',layoutsDir: path.join(__dirname, 'views', 'layout'),partialsDir:path.join(__dirname, 'views', 'partials')}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload())


app.use(session({secret: "key",resave: false,saveUninitialized: false,cookie:{maxAge: 600000}}));

// database connection

// db.connect((err)=>{
//   if(err) console.log("Database connection failes:",err)
//   else console.log("Database connected succesfullly")  
// })

const mongoose = require("mongoose");
require("dotenv").config(); // Ensure dotenv is used

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
