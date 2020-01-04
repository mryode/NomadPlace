const express = require('express');

const placeController = require('../controllers/placeController');

const router = express.Router();

// Home Page
router.get('/', placeController.homePage);

// Add Place
// TODO Check if the user logged in
router.get('/add', placeController.addPlace);
// TODO Create form validator
// router.post('/add', placeController.savePlaceToDB);

module.exports = router;
