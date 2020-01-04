const express = require('express');

const placeController = require('../controllers/placeController');

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

module.exports = router;
