/*jshint node:true*/
/* global require, module*/
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var cssImport = require("postcss-import");
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    minifyJS: {
      enabled: false
    },
    minifyCSS: {
      enabled: false
    },
    postcssOptions: {
      plugins: [
        {
          module: cssImport,
          options: {
            path: ["app/styles"]
          }
        },
        {
          module: autoprefixer,
          options: {
            browsers: ['last 2 version']
          }
        },
        {
          module: cssnext,
          options: {}
        }
      ]
    }
  });

  app.import('bower_components/chroma-js/chroma.js')
  app.import('bower_components/three.js/build/three.js')
  app.import('bower_components/three.js/examples/js/controls/OrbitControls.js')
  app.import('bower_components/threex.domevents/threex.domevents.js')
  app.import('bower_components/threex.windowresize/threex.windowresize.js')
  app.import('bower_components/lodash/lodash.js')
  app.import('bower_components/tween.js/src/Tween.js')
  app.import('bower_components/masonry/dist/masonry.pkgd.js')
  app.import('bower_components/stats.js/build/stats.min.js')
  app.import('bower_components/threex.rendererstats/threex.rendererstats.js')
  app.import('bower_components/threex.objcoord/threex.objcoord.js')
  app.import('bower_components/three.js/examples/js/renderers/Projector.js')


  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
