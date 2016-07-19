var config = require('../config')

var gulp = require('gulp')
var del = require('del')

var cleanTask = function (cb) {
  del([config.root.dest]).then(function (paths) {
    cb()
  })
}

gulp.task('clean', cleanTask)
module.exports = cleanTask
