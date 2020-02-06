const express = require('express');

const placeController = require('../controllers/placeController');
const reviewController = require('../controllers/reviewController');

const { catchErrors } = require('../handlers/errorHandler');

const router = express.Router();

/**
 * API
 */
router.get('/v1/search', catchErrors(placeController.searchPlaces));
router.post('/v1/places/:id/heart', catchErrors(placeController.heartPlace));
router.get('/v1/places', catchErrors(placeController.mapPlaces));
router.post(
  '/v1/reviews/:id/delete',
  catchErrors(reviewController.deleteReview)
);

module.exports = router;
