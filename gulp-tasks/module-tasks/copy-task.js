var path = require('path');
var filter = require('../lib/gulp-mini-filter.js');
var sort = require('../lib/gulp-sort');
var fs = require('fs');
var clean = require('gulp-rimraf');

module.exports = function (gulp, module) {

  var exclude = /(\.css|\.js|\.svg|\.map|\.less|\.map)$/i;

  // Sometimes node is unable to read the stat property (file-busy)

  function isFile(file) {
    try {
      return file.stat && file.stat.isFile();
    } catch (e) {
      return false;
    }
  }

  // Cleaning the copy must go in two phases.
  // gulp-rimraf will throw an exception if a file is already deleted by deleting the containing directory.
  // So we first clean the files and then any empty directory leftovers.

  // This task can only start AFTER the other modules tasks. The build will crash if any of the other tasks
  // is writing output files and it's somehow included in the gulp.src().

  module.task('copy-clean', ['scripts', 'styles', 'svg'], function () {

    var outputFiles = [
      path.join(module.folders.dest, '**/*')
    ];

    return gulp.src(outputFiles, { read: false })
      .pipe(filter(function (file) {
        return !exclude.test(file.path) && isFile(file);
      }))
      .pipe(clean({ force: true }));

  });

  module.task('copy-clean-dirs', ['copy-clean'], function () {
    var outputFiles = [
      path.join(module.folders.dest, '**/*')
    ];

    return gulp.src(outputFiles, { read: false })
      .pipe(filter(function (file) {
        // Only include directories
        return !exclude.test(file.path) && !isFile(file);
      }))
      .pipe(sort(function (fileA, fileB) {
        // Reorder directories -- deepest first

        var a = fileA.path.split(path.sep).length;
        var b = fileB.path.split(path.sep).length;

        return b - a;
      }))
      .pipe(filter(function (file) {
        // Only empty directories
        var files = fs.readdirSync(file.path);
        return !files || files.length == 0;
      }))
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
        return !exclude.test(file.path) && isFile(file);
      }))
      .pipe(gulp.dest(module.folders.dest));

  });

};

