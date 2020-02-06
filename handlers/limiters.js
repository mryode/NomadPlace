const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

const getRateLimiterFor = (max, windowMs, keyGenerator) => {
  const store = new MongoStore({
    uri: process.env.DATABASE_URI,
  });

  return new RateLimit({
    windowMs,
    max,
    store,
    keyGenerator,
  });
};

exports.pages = getRateLimiterFor(20, 60000, req => req.ip);
exports.api = getRateLimiterFor(50, 60000, req => req.ip);
exports.email = getRateLimiterFor(5, 360000, req => req.body.email);
