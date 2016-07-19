var config = require('../config')

var browserSync = require('browser-sync')
var gulp = require('gulp')
var handleErrors = require('../lib/handleErrors')
var path = require('path')
var uglify = require('gulp-uglify')

var paths = {
  src: path.join(config.root.src, config.tasks.scripts.src,'/**/**/**/*.{' + config.tasks.scripts.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.scripts.dest)
}

var scriptsTask = function () {
  return gulp.src(paths.src)
    .pipe(uglify())
    .on('error', handleErrors)
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
}

gulp.task('scripts', scriptsTask)
module.exports = scriptsTask
