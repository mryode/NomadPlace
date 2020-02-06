const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const csrf = require('csurf');

const helpers = require('./utils/helpers');
const errorHandler = require('./handlers/errorHandler');
const helmetConfig = require('./handlers/helmet');
const rateLimiter = require('./handlers/limiters');
const auth = require('./handlers/auth');
const xss = require('./handlers/xss');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

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
      maxAge: 60000 * 60 * 5, // 5hr
      // secure: true, // TODO set true on HTTPS
      sameSite: true,
    },
  })
);

// Passport configuration
require('./handlers/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(auth.authenticateRequest);

// Pass variables to the templates and requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.currentPath = req.path;
  res.locals.user = req.user || null;

  next(); // After adding - continue...
});

app.use(csrf({ cookie: false }));
app.use((req, res, next) => {
  if (req.session) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

xss.sanitizeBody(app);

app.use('/', rateLimiter.pages, indexRouter);
app.use('/api/', rateLimiter.api, apiRouter);

// Error handlers
app.use(errorHandler.notFound);
app.use(errorHandler.csrfError);
app.use(errorHandler.formValidationErrors);
app.use(errorHandler.flashValidationErrors);
if (app.get('env') === 'development') {
  app.use(errorHandler.developmentErrors);
}
app.use(errorHandler.productionErrors);

module.exports = app;
