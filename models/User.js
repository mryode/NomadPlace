const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const md5 = require('md5');

const { Schema } = mongoose;

const userSchema = new Schema({
  // TODO add validation for emails
  email: {
    type: String,
    required: 'You must supply an email.',
    lowercase: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: 'You must supply a name.',
    trim: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://www.gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
