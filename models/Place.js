const mongoose = require('mongoose');
const slug = require('slug');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'You must supply place name.',
  },
  description: {
    type: String,
    required: 'You must supply place description.',
  },
  slug: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
  photo: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

placeSchema.pre('save', function(next) {
  // Not using arrow function because I'm using `this`
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model('Place', placeSchema);
