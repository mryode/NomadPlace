const mongoose = require('mongoose');

const Review = require('../models/Review');
const Place = require('../models/Place');

exports.addReview = async (req, res) => {
  req.body.author = req.user._id;
  req.body.place = req.params.id;

  const review = await Review.create(req.body);
  await Place.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { reviews: review._id } },
    { new: true }
  );

  req.flash('success', "You're review successfully added! 📨");
  res.redirect('back');
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review.author._id.equals(req.user._id)) {
    await review.remove();
    req.flash('success', "You've removed your review ❌");
    res.redirect(req.get('referer'));
  }
};
