const authRoutes = [
  { path: '/add', method: ['GET', 'POST'] },
  { path: '/logout', method: ['GET'] },
  { path: '/account/info', method: ['GET', 'POST'] },
  { path: '/review', method: ['POST'] },
  { path: '/api/v1', method: ['POST'] },
];

const logoutRoutes = [
  { path: '/login', method: ['GET', 'POST'] },
  { path: '/register', method: ['GET', 'POST'] },
];

function checkRoutes(req, routes) {
  return routes.some(
    endpoint =>
      req.originalUrl.startsWith(endpoint.path) &&
      endpoint.method.includes(req.method)
  );
}

function getCurrentUserName(req) {
  return req.session && req.session.passport && req.session.passport.user;
}

exports.authenticateRequest = (req, res, next) => {
  if (!checkRoutes(req, authRoutes)) {
    return next();
  }

  const user = getCurrentUserName(req);
  if (user && checkRoutes(req, logoutRoutes)) {
    req.flash('error', 'You must be logged out.');
    res.redirect('back');
  } else if (!user) {
    req.flash('error', 'You must be logged in.');
    res.redirect(303, '/login');
  } else {
    return next();
  }
};
