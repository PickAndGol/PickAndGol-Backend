'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
let config = require('config');

var index = require('./routes/index');


require('./models/Events');

var app = express();

// don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    // use morgan to log at command line
    app.use(logger('dev'));
}

// Cross domain avoid
app.options('*', cors());

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Base de datos
require('./lib/connectMongoose');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

//Routes
let users = require('./routes/api/v1/users');
app.use('/api/v1/users', users.router);
app.use('/api/v1/users', users.jwtRouter);

let pubs = require('./routes/api/v1/pubs');
app.use('/api/v1/pubs', pubs.router);
app.use('/api/v1/pubs', pubs.jwtRouter);

//models
var Event = require('./models/Events');


//routes
let events = require('./routes/api/v1/events');
app.use('/api/v1/events', events.router);
app.use('/api/v1/events', events.jwtRouter);

let categories = require('./routes/api/v1/categories');
app.use('/api/v1/categories', categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
