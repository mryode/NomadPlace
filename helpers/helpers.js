const fs = require('fs');

// Inserting an SVG
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Navbar tiles
exports.menu = [
  { slug: '/places', title: 'Places', icon: 'places' },
  { slug: '/tags', title: 'Tags', icon: 'tag' },
  { slug: '/top', title: 'Top', icon: 'top' },
  { slug: '/add', title: 'Add', icon: 'add' },
  { slug: '/map', title: 'Map', icon: 'map' },
];
