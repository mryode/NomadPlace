const expressSanitizer = require('express-sanitizer');

exports.sanitizeBody = app => {
  app.use(expressSanitizer());

  app.use((req, res, next) => {
    for (const key of Object.keys(req.body)) {
      console.log('req.body[key]', req.body[key]);
      req.body[key] = req.sanitize(req.body[key]);
      console.log('req.body[key]', req.body[key]);
    }
    next();
  });
};
