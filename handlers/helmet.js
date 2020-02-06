const helmet = require('helmet');
const uuid = require('uuid');

function helmetConfig(app) {
  app.use(helmet.hidePoweredBy());
  app.use(helmet.dnsPrefetchControl({ allow: false }));
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter({ setOnOldIE: true }));
  app.use((req, res, next) => {
    res.locals.nonce = uuid.v4();
    next();
  });
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'api.mapbox.com',
          (req, res) => `'nonce-${res.locals.nonce}'`,
        ],
        styleSrc: [
          "'self'",
          'fonts.googleapis.com',
          'https://api.mapbox.com',
          'https://*.algolia.net',
          'https://*.algolianet.com',
          "'unsafe-inline'",
        ],
        imgSrc: [
          "'self'",
          'www.gravatar.com',
          'https://api.mapbox.com',
          'data:',
          'blob:',
        ],
        fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
        connectSrc: [
          "'self'",
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://*.algolia.net',
          'https://*.algolianet.com',
        ],
      },
    })
  );
}

module.exports = helmetConfig;
