const mongoose = require('mongoose');
const slug = require('slug');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'You must supply place name.',
  },
  description: {
    type: String,
    trim: true,
    required: 'You must supply place description.',
  },
  slug: {
    type: String,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  photo: {
    type: String,
    trim: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an Author.',
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
