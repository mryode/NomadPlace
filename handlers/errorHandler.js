// async/await wrapper instead using try/catch
exports.catchErrors = fn =>
  function(req, res, next) {
    return fn(req, res, next).catch(next);
  };

exports.csrfError = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    const error = new Error('Invalid CSRF Token');
    error.status = 403;
  }
  return next(err);
};

exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

exports.formValidationErrors = (err, req, res, next) => {
  if (!err.error_type) return next(err);

  err.errors.map(error => req.flash(error.type, error.message));
  // TODO repopulate the form
  res.redirect('back');
};

exports.flashValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);

  // validation errors look like
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => req.flash('error', err.errors[key].message));
  res.redirect('back');
};

exports.developmentErrors = (err, req, res, next) => {
  console.error(err);

  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    ),
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      res.render('error', errorDetails);
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails), // Ajax call, send JSON back
  });
};

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
};
