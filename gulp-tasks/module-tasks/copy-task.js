var path = require('path');
var filter = require('../lib/gulp-mini-filter.js');
var sort = require('../lib/gulp-sort');
var fs = require('fs');
var clean = require('gulp-rimraf');

module.exports = function (gulp, module) {

  var exclude = '*.css|*.js|*.svg|*.map';

  module.task('copy-clean', function () {

    var outputFiles = [
      path.join(module.folders.dest, '**/!(' + exclude + ')')
    ];

    return gulp.src(outputFiles, { read: false })
      .pipe(filter(function (file) {
        // gulp-rimraf will throw an exception if a file is already deleted by deleting the containing directory.
        return file.stat.isFile();
      }))
      .pipe(clean({ force: true }));

  });

  module.task('copy-clean-dirs', ['copy-clean'], function() {
    var outputFiles = [
      path.join(module.folders.dest, '**/!(' + exclude + ')')
    ];

    return gulp.src(outputFiles, { read: false })
      .pipe(filter(function(file) {
        // Only include directories
        return !file.stat.isFile();
      }))
      .pipe(sort(function(fileA, fileB) {
        // Reorder directories -- deepest first

        var a = fileA.path.split(path.sep).length;
        var b = fileB.path.split(path.sep).length;

        return b - a;
      }))
      .pipe(filter(function(file) {
        // Only empty directories
        var files = fs.readdirSync(file.path);
        return !files || files.length == 0;
      }))
//      .pipe(filter(function(file) {
//        console.log(file);
//        return true;
//      }))
      .pipe(clean({ force: true }));
  });

  module.task('copy', ['scripts', 'styles', 'svg', 'copy-clean-dirs'], function () {

    var glob = [
      path.join(module.folders.src, '/**/*'),
      '!**/*.test.js',
      '!**/*.ignore.*'
    ];

    module.touched.forEach(function (filename) {
      glob.push('!' + filename);
    });

    return gulp.src(glob)
      .pipe(filter(function (file) {
        // Only copy files -- don't copy empty directories
        return file.stat.isFile();
      }))
      .pipe(gulp.dest(module.folders.dest));

  });

};

