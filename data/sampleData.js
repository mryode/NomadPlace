require('dotenv').config({ path: `${__dirname}/../.env` });
const fs = require('fs');
const mongoose = require('mongoose');

const Place = require('../models/Place');
const User = require('../models/User');

const places = JSON.parse(
  fs.readFileSync(`${__dirname}/json/places.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/json/users.json`, 'utf-8')
);

async function deleteData() {
  console.log('Deleting Data...');
  await Place.deleteMany();
  await User.deleteMany();
  console.log('Data Deleted. To load sample data, run\n\n\t npm run load\n\n');
  process.exit();
}

async function loadData() {
  console.log('Loading Data...');
  try {
    await Place.insertMany(places);
    await User.insertMany(users);
    console.log('Done!');
    process.exit();
  } catch (e) {
    console.error(
      'Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run delete\n\n\n'
    );
    console.error(e);
    process.exit();
  }
}

// Connecting to MongoDB
mongoose.connect(
  process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connected to mongoDB!');
    if (process.argv.includes('--delete')) {
      deleteData();
    } else {
      loadData();
    }
  }
);
