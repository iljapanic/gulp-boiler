var config = require('../config')

var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync')
var cssnano = require('gulp-cssnano')
var gmq = require('gulp-group-css-media-queries')
var gulp = require('gulp')
var handleErrors = require('../lib/handleErrors')
var path = require('path')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')

var paths = {
  src: path.join(config.root.src, config.tasks.css.src, '/**/**/*.{' + config.tasks.css.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.css.dest)
}

var cssTask = function () {
  return gulp.src(paths.src)
		.pipe(sourcemaps.init())
		.pipe(sass())
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(config.tasks.css.autoprefixer))
    .pipe(gmq())
    .pipe(cssnano({autoprefixer: false}))
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask
