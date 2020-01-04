require('dotenv').config();

const mongoose = require('mongoose');

const app = require('./app');

// Connecting to MongoDB
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// TODO Create better error handler?
mongoose.connection.on('error', err => console.error(err));

// Import mongoose models
require('./models/Place'); // -> mongoose.model('Place', placeSchema)

// Start the server
app.set('port', process.env.PORT || 5555);
const server = app.listen(app.get('port'), () =>
  console.log(`Server running ➡  ${server.address().port}`)
);
