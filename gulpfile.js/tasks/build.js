var gulp = require('gulp')
var gulpSequence = require('gulp-sequence')

var buildTask = function (cb) {
  gulpSequence('clean', 'images', 'html', 'css', 'scripts', cb)
}

gulp.task('build', buildTask)
module.exports = buildTask
