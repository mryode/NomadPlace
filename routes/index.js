const express = require('express');

const placeController = require('../controllers/placeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandler');

const router = express.Router();

// Home Page
router.get('/', placeController.homePage);

// Add Place
// TODO Check if the user logged in
// TODO Create form validator
router.get('/add', placeController.addPlace);
router.post(
  '/add',
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
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post(
  '/register',
  catchErrors(userController.register),
  authController.login
);
router.get('/logout', authController.logout);
// Account endpoints
router.get('/account', userController.accountPage);
router.post('/account', catchErrors(userController.updateAccount));
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
  catchErrors(placeController.updatePlace)
);

// Place page
router.get('/place/:slug', catchErrors(placeController.getPlaceBySlug));

// Tags
router.get('/tags', catchErrors(placeController.getPlacesByTag));

module.exports = router;
