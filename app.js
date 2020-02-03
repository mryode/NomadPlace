const express = require('express');
const session = require('express-session');
const RateLimit = require('express-rate-limit');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

const helpers = require('./utils/helpers');
const errorHandler = require('./handlers/errorHandler');
const helmetConfig = require('./handlers/helmet');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

helmetConfig(app);

app.use(
  new RateLimit({
    max: 30,
    duration: 60000, // 1m in miliseconds
  })
);
// SessionID saved inside the cookie itself
// Session data saved on MongoStore
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: true,
    },
  })
);

// Passport configuration
require('./handlers/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Pass variables to the templates and requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.currentPath = req.path;
  res.locals.user = req.user || null;

  next(); // After adding - continue...
});

app.use('/', indexRouter);

// Error handlers
app.use(errorHandler.notFound);

// Check for any validation errors when submitting a form
app.use(errorHandler.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandler.developmentErrors);
}

// production error handler
app.use(errorHandler.productionErrors);

module.exports = app;
