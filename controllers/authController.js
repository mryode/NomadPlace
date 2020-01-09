const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

/*
 *  ENDPOINT
 */
exports.logout = (req, res) => {
  req.logout();
  req.flash('success', "You've looked out successfully 👋");
  res.redirect('back');
};
/*
 *  MIDDLEWARE
 */
exports.login = passport.authenticate('local', {
  failureFlash: 'Failed to login, please try again.',
  failureRedirect: '/login',
  successFlash: "You've successfully logged in! 🙋‍♂️",
  successRedirect: '/',
});

/*
 *  API
 */
