const express = require('express');

const placeController = require('../controllers/placeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { catchErrors } = require('../handlers/errorHandler');
const rateLimiter = require('../handlers/limiters');
const validator = require('../handlers/validator');

const router = express.Router();

const print = (req, res, next) => {
  console.log('req.body', req.body);
  next();
};

// Home Page
router.get('/', placeController.getPlaces);

// Add Place
router.get('/add', placeController.addPlace);
router.post(
  '/add',
  placeController.uploadImage,
  catchErrors(placeController.resizeImage),
  validator.validationRules('edit'),
  validator.validate,
  catchErrors(placeController.savePlaceInDB)
);

// Display places
router.get('/places', catchErrors(placeController.getPlaces));

// Users
router.get('/login', userController.loginForm);
router.post(
  '/login',
  rateLimiter.email,
  validator.validationRules('login'),
  validator.validate,
  authController.login
);
router.get('/register', userController.registerForm);
router.post(
  '/register',
  validator.validationRules('register'),
  validator.validate,
  catchErrors(userController.register),
  authController.login
);
router.get('/logout', authController.logout);
// Account endpoints
router.get('/account/info', userController.accountPage);
router.post(
  '/account/info',
  validator.validationRules('account'),
  validator.validate,
  catchErrors(userController.updateAccount)
);
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', authController.reset);
router.post(
  '/account/reset/:token',
  catchErrors(authController.updateNewPassword)
);

// Edit
router.get('/places/:id/edit', placeController.editPlace);
router.post(
  '/add/:id',
  placeController.uploadImage,
  catchErrors(placeController.resizeImage),
  validator.validationRules('edit'),
  validator.validate,
  catchErrors(placeController.updatePlace)
);

// Place page
router.get('/place/:slug', catchErrors(placeController.getPlaceBySlug));

// Tags
router.get('/tags', catchErrors(placeController.getPlacesByTag));

// Hearts
router.get('/hearts', catchErrors(placeController.getHeartsPage));

// Map
router.get('/map', placeController.mapPage);

// Reviews
router.post(
  '/review/:id',
  validator.validationRules('review'),
  validator.validate,
  catchErrors(reviewController.addReview)
);

module.exports = router;
