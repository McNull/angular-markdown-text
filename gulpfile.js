#!/usr/bin/env node

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var config = require('./build-config.js');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var gulp = require('gulp');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

require('./gulp-tasks/bower-task.js')(gulp);
require('./gulp-tasks/index-task.js')(gulp);
require('./gulp-tasks/modules-task.js')(gulp);

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

gulp.task('build', [ 'modules', 'bower', 'index' ]);
gulp.task('default', [ 'build' ]);

// - - - - 8-< - - - - - - - - - - - - - - - - - - -