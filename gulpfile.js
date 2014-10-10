#!/usr/bin/env node

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var config = require('./build-config.js');
var path = require('path');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var gulp = require('gulp');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

require('./gulp-tasks/bower-task.js')(gulp);
require('./gulp-tasks/index-task.js')(gulp);
require('./gulp-tasks/modules-task.js')(gulp);

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var karma = require('gulp-karma');

gulp.task('test-run', ['angular-markdown-text'], function () {

  return gulp.src([
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    path.join(config.folders.dest, 'angular-markdown-text/angular-markdown-text.min.js'),
    path.join(config.folders.src, 'angular-markdown-text/**/*.test.js')
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    })).on('error', function (err) {
      throw err;
    });

});

gulp.task('test-watch', ['angular-markdown-text'], function () {

  gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/lodash/dist/lodash.compat.js',
    path.join(config.folders.src, 'angular-markdown-text/angular-markdown-text.js'),
    path.join(config.folders.dest, 'angular-markdown-text/angular-markdown-text-templates.js'),
    path.join(config.folders.src, 'angular-markdown-text/**/*.js')
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));

});

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

gulp.task('build', [ 'modules', 'bower', 'index' ]);
gulp.task('watch', [ 'modules-watch']);
gulp.task('default', [ 'build' ]);

// - - - - 8-< - - - - - - - - - - - - - - - - - - -