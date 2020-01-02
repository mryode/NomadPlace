const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const helpers = require('./helpers/helpers');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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

// Pass variables to the templates and requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.currentPath = req.path;

  next(); // After adding - continue...
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
