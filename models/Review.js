const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply review author.',
  },
  place: {
    type: mongoose.Schema.ObjectId,
    ref: 'Place',
    required: 'You must supply review place.',
  },
  title: {
    type: String,
    trim: true,
    required: 'You must supply review title.',
  },
  text: {
    type: String,
    trim: true,
    required: 'You must supply review text.',
  },
  rating: {
    type: Number,
    min: 0.5,
    max: 5,
    required: 'You must supply review rating between 0 to 5.',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

function autoPopulate(next) {
  this.populate('author');
  next();
}

reviewSchema.pre('find', autoPopulate);
reviewSchema.pre('findOne', autoPopulate);

module.exports = mongoose.model('Review', reviewSchema);
