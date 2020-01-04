/*
 *  ENDPOINTS
 */
exports.homePage = (req, res) => {
  res.render('place', { title: 'Home' });
};

exports.addPlace = (req, res) => {
  res.render('editPlace', { title: 'Add Place' });
};

/*
 *  MIDDLEWARE
 */

/*
 *  API
 */
