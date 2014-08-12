
// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var config = require('../build-config.js');
var modify = require('./lib/gulp-modify-content.js');
var pkg = require('../package.json');
var _ = require('lodash');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

module.exports = function (gulp) {

  gulp.task('index', [], function () {

    return gulp.src('index.html', {
      cwd: config.folders.src
    }).pipe(modify(function (content) {

      var css = [], js = [];

      var ext = config.env === 'production' ? '.min' : '';

      _.forEach(config.modules, function (module) {
        css.push(module.name + '/' + module.name + ext + '.css');
        js.push(module.name + '/' + module.name + ext + '.js');
      });

      return _.template(content, {
        pkg: pkg, css: css, js: js
      });

    })).pipe(gulp.dest(config.folders.dest));

  });
};

// - - - - 8-< - - - - - - - - - - - - - - - - - - -
