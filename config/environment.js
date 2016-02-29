/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'pulse',
    podModulePrefix: 'pulse/pods',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    // locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' https://use.typekit.net/ ('sha256-5kMb497w7ItxXRHeDONhgk1HOjOqzAVeP4/0KPiMW0Y=')",
      'font-src': "'self' data: use.typekit.net",
      // 'connect-src': "'self'",
      'connect-src': "'self' http://localhost:3000",
      'img-src': "'self' https://s3.amazonaws.com/ https://p.typekit.net",
      'style-src': "'self' 'unsafe-inline' https://use.typekit.net/",
      'media-src': "'self'"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
