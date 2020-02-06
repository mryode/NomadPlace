const express = require('express');

const placeController = require('../controllers/placeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { catchErrors } = require('../handlers/errorHandler');
const rateLimiter = require('../handlers/limiters');
const validator = require('../handlers/validator');

const router = express.Router();

// Home Page
router.get('/', placeController.getPlaces);

// Add Place
// TODO Check if user logged in
// TODO Create form validator
router.get('/add', placeController.addPlace);
router.post(
  '/add',
  validator.validationRules('edit'),
  validator.validate,
  placeController.uploadImage,
  catchErrors(placeController.resizeImage),
  catchErrors(placeController.savePlaceInDB)
);

// Display places
router.get('/places', catchErrors(placeController.getPlaces));

// Users
// TODO validate forms
// TODO check if logged in/out before doing things (no logout if not logged in)
// Session endpoints
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
  validator.validationRules('edit'),
  validator.validate,
  placeController.uploadImage,
  catchErrors(placeController.resizeImage),
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
