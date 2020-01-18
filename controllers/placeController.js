const mongoose = require('mongoose');
const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');

const Place = mongoose.model('Place');
const User = mongoose.model('User');

const isOwner = (place, user) => place.author.equals(user._id);
/*
 *  ENDPOINTS
 */
exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.addPlace = (req, res) => {
  res.render('editPlace', { title: 'Add Place' });
};

exports.savePlaceInDB = async (req, res) => {
  req.body.author = req.user._id;

  const place = await Place.create(req.body);
  // TODO Reflective XSS warning sanitize place name
  req.flash('success', `${place.name} was created!`);

  // TODO redirect to the place page
  res.redirect('/');
};

exports.getPlaces = async (req, res) => {
  const places = await Place.find();
  res.render('places', { title: 'Places', places });
};

exports.editPlace = async (req, res) => {
  const place = await Place.findById(req.params.id);

  if (!place) {
    req.flash('error', 'Place not found 🏸');
    res.redirect('back');
  }

  if (!isOwner(place, req.user)) {
    req.flash('error', 'You must be the place owner to edit it ⛔');
    res.redirect('back');
  }

  res.render('editPlace', { title: `Edit ${place.name}`, place });
};

exports.updatePlace = async (req, res) => {
  req.body.location.type = 'Point';

  // console.log('req.body', req.body);

  const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  console.log('place', place);

  if (!place) {
    req.flash('error', 'Place not found 🏸');
    res.redirect('back');
  }

  req.flash(
    'success',
    `Successfully edited <strong>${place.name}</strong>. <a href='/place/${place.slug}'>View place -></a>`
  );
  res.redirect(`/places/${place._id}/edit`);
};

exports.getPlaceBySlug = async (req, res) => {
  const place = await Place.findOne({ slug: req.params.slug });

  if (!place) {
    req.flash('error', 'Place not found 😞');
    res.redirect('/places');
  }

  res.render('place', { title: place.name, place });
};

exports.getPlacesByTag = async (req, res) => {
  const selectedTags = req.query.tags || [];
  const tagsQuery = selectedTags.length
    ? { $all: selectedTags }
    : { $exists: true };

  const tagsPromise = Place.getTagsList();
  const placePromise = Place.find({ tags: tagsQuery });

  const [tagsList, places] = await Promise.all([tagsPromise, placePromise]);
  const count = places.length;
  res.render('tags', { title: 'Tags', count, tagsList, selectedTags, places });
};

exports.getHeartsPage = async (req, res) => {
  const userHearts = req.user.hearts;
  const places = await Place.find({ _id: userHearts });

  res.render('places', { title: 'Places you liked 💘', places });
};

exports.mapPage = (req, res) => {
  res.render('map', { title: 'View places on map 🗺' });
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
exports.searchPlaces = async (req, res) => {
  const places = await Place.find(
    { $text: { $search: req.query.q } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  res.json(places);
};

exports.heartPlace = async (req, res) => {
  const userHearts = req.user.hearts.map(h => h.toString());
  const action = userHearts.includes(req.params.id) ? '$pull' : '$addToSet';

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { [action]: { hearts: req.params.id } },
    { new: true }
  );

  res.json(user);
};

exports.mapPlaces = async (req, res) => {
  const places = await Place.getPlacesList();

  res.json(places);
};
