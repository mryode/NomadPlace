const fs = require('fs');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

// Inserting an SVG
// eslint-disable-next-line security/detect-non-literal-fs-filename
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Navbar tiles
exports.menu = [
  { slug: '/places', title: 'Places', icon: 'places' },
  { slug: '/tags', title: 'Tags', icon: 'tag' },
  { slug: '/top', title: 'Top', icon: 'top' },
  { slug: '/add', title: 'Add', icon: 'add' },
  { slug: '/map', title: 'Map', icon: 'map' },
];

exports.tags = ['Wifi', 'Open Late', 'Pet Friendly', 'Licensed'];
