var config = require('../config')

var browserSync = require('browser-sync')
var gulp = require('gulp')
var handleErrors = require('../lib/handleErrors')
var markdown = require('gulp-markdown')
var path = require('path')

var paths = {
  src: path.join(config.root.src, config.tasks.markdown.src, '/**/**/**/**/*.{' + config.tasks.markdown.extensions + '}'),
  dest: path.join(config.root.src, config.tasks.html.src, config.tasks.markdown.dest)
}

var markdownTask = function () {
  return gulp.src(paths.src)
		.pipe(markdown())
    .on('error', handleErrors)
		.pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
}

gulp.task('markdown', markdownTask)
module.exports = markdownTask
