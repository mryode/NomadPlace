const mongoose = require('mongoose');
const passport = require('passport');
const crypto = require('crypto');
const promisify = require('es6-promisify');

const mailer = require('../handlers/mail');

const User = mongoose.model('User');

/*
 *  ENDPOINT
 */
exports.logout = (req, res) => {
  req.logout();
  req.flash('success', "You've looked out successfully 👋");
  res.redirect('back');
};

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;

    await mailer.send({
      user,
      subject: 'NomadPlace - Reset Password',
      resetURL,
      pugFilename: 'password-reset',
    });
  }

  req.flash('info', "We've sent mail to your email address!");
  return res.redirect('/login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash('error', 'Token expired or invalid, please try again.');
    res.redirect('back');
  }

  res.render('reset', { title: 'Reset password 🔁' });
};

exports.updateNewPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  const equal =
    req.headers.referer ===
    `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  if (!equal || !user) {
    req.flash('error', 'Token expired or invalid, please try again.');
    res.redirect('back');
  }

  await user.setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();

  const login = promisify.promisify(req.login.bind(req));
  await login(updatedUser);

  req.flash(
    'success',
    "You've successfully reset your password. You're now logged in 🙋‍♂️"
  );
  res.redirect('/');
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
