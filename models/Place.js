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
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply coordinates.',
      },
    ],
    address: {
      type: String,
      required: 'You must supply address.',
    },
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

placeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

placeSchema.pre('save', async function(next) {
  // Not using arrow function because I'm using `this`
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = slug(this.name);
  // eslint-disable-next-line security/detect-non-literal-regexp
  const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');

  const placesWithSlug = await this.constructor.find({ slug: slugRegex });
  if (placesWithSlug.length) {
    this.slug = `${this.slug}-${placesWithSlug.length + 1}`;
  }

  next();
});

module.exports = mongoose.model('Place', placeSchema);
