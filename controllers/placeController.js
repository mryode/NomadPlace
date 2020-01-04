const mongoose = require('mongoose');
const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');

const Place = mongoose.model('Place');
/*
 *  ENDPOINTS
 */
exports.homePage = (req, res) => {
  res.render('place', { title: 'Home' });
};

exports.addPlace = (req, res) => {
  res.render('editPlace', { title: 'Add Place' });
};

exports.savePlaceInDB = async (req, res) => {
  const place = await Place.create(req.body);
  req.flash('success', `${place.name} was created!`);

  // TODO redirect to the place page
  res.redirect('/');
};

/*
 *  MIDDLEWARE
 */
const uploader = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    return isPhoto
      ? next(null, true)
      : next({ message: "This filetype isn't allowed!" }, false);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

exports.uploadImage = uploader.single('photo');

exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const imageExtension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${imageExtension}`;

  const image = await jimp.read(req.file.buffer);
  await image.resize(800, jimp.AUTO);
  await image.write(`./public/uploads/${req.body.photo}`);

  next();
};

/*
 *  API
 */
