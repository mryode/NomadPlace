const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const helpers = require('./utils/helpers');
const errorHandler = require('./handlers/errorHandler');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Compile the .scss file into one unified .css file
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public/sass/'),
    dest: path.join(__dirname, 'public/'),
    debug: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// SessionID saved inside the cookie itself
// Session data saved on MongoStore
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    key: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(flash());

// Pass variables to the templates and requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.currentPath = req.path;

  next(); // After adding - continue...
});

app.use('/', indexRouter);

// Error handlers
app.use(errorHandler.notFound);

// Check for any validation errors when submitting a form
app.use(errorHandler.flashValidationErrors);

module.exports = app;
