const fs = require('fs');

exports.moment = require('moment');

exports.dump = obj => JSON.stringify(obj, null, 2);

// Inserting an SVG
// eslint-disable-next-line security/detect-non-literal-fs-filename
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Navbar tiles
exports.menu = [
  { slug: '/places', title: 'Places', icon: 'places' },
  { slug: '/tags', title: 'Tags', icon: 'tag' },
  // { slug: '/top', title: 'Top', icon: 'top' },
  { slug: '/add', title: 'Add', icon: 'add' },
  { slug: '/map', title: 'Map', icon: 'map' },
];

exports.tags = ['Wifi', 'Open Late', 'Pet Friendly', 'Licensed'];

exports.staticMap = ([lng, lat]) =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},12/800x150?access_token=${process.env.MAPBOX_KEY}`;
