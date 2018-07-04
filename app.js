var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bodyParser = require('body-parser');
var expressHsb = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

var app = express();

mongoose.connect('mongodb://localhost:27017/shopping');
require('./config/passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',expressHsb({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Session
app.use(session({secret: 'secret',resave: false, saveUninitialized: false}));

//Passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(validator());

var path = require ('path');
app.use(express.static(path.join(__dirname + '.../public')));

app.use('/', indexRouter);

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

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected');
});

module.exports = app;
