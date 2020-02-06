const { body, validationResult } = require('express-validator');

class ValidationError extends Error {
  constructor(errors, errorType) {
    super();

    this.errors = errors;
    this.error_type = errorType;
  }
}

exports.validationRules = method => {
  switch (method) {
    case 'login':
      return [
        body('email')
          .isEmail()
          .withMessage('Please enter valid email address.')
          .notEmpty()
          .withMessage('You must supply email address.'),
        body('password', 'Please enter an password.').notEmpty(),
      ];
    case 'register':
      return [
        body('name', 'Please enter valid name.')
          .escape()
          .trim()
          .notEmpty(),
        body('email')
          .escape()
          .trim()
          .isEmail()
          .withMessage('Please enter valid email address.')
          .notEmpty()
          .withMessage('You must supply email address.'),
        body('password', 'Please enter an password.').notEmpty(),
        body(
          'password-confirm',
          'Please enter password confirmation.'
        ).notEmpty(),
      ];
    case 'account':
      return [
        body('name', 'Please enter valid name.')
          .escape()
          .trim()
          .notEmpty(),
        body('email')
          .escape()
          .trim()
          .isEmail()
          .withMessage('Please enter valid email address.')
          .notEmpty()
          .withMessage('You must supply email address.'),
      ];
    case 'edit':
      return [
        body('name', 'You must supply a name!')
          .escape()
          .trim()
          .notEmpty(),
        body('description', 'You must supply a description!')
          .escape()
          .trim()
          .notEmpty(),
        body('address', 'You must supply a address!')
          .escape()
          .trim()
          .notEmpty(),
        body('lat', 'You must supply a lat!')
          .toFloat()
          .notEmpty(),
        body('lng', 'You must supply a lng!')
          .toFloat()
          .notEmpty(),
      ];
    case 'review':
      return [
        body('title', 'You must supply a title.')
          .trim()
          .notEmpty(),
        body('text', 'You must supply a text.')
          .trim()
          .notEmpty(),
      ];

    default:
      return [];
  }
};

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors
    .array()
    .map(err => extractedErrors.push({ type: 'error', message: err.msg }));

  throw new ValidationError(extractedErrors, 'validation');
};
