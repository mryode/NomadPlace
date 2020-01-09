require('dotenv').config();

const mongoose = require('mongoose');

// Connecting to MongoDB
mongoose.connect(
  process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => console.log('Connected to mongoDB!')
);

// TODO Create better error handler?
mongoose.connection.on('error', err => console.error(err));

// Import mongoose models
require('./models/Place'); // -> mongoose.model('Place', placeSchema)
require('./models/User'); // -> mongoose.model('User', userSchema)

// Start the server
const app = require('./app');

app.set('port', process.env.PORT || 5555);
const server = app.listen(app.get('port'), () =>
  console.log(`Server running ➡  ${server.address().port}`)
);
