const mongoose = require('mongoose');
const promisify = require('es6-promisify');

const User = mongoose.model('User');

/*
 *  ENDPOINT
 */
exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

/*
 *  MIDDLEWARE
 */
exports.register = async (req, res, next) => {
  console.log('req.body', req.body);

  const user = new User({ email: req.body.email, name: req.body.name });

  const register = promisify.promisify(User.register.bind(User));

  await register(user, req.body.password);

  next();
};

/*
 *  API
 */
