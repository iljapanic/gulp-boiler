var config = require('../config')

var browserSync = require('browser-sync')
var gulp = require('gulp')

var browserSyncTask = function () {
  browserSync.init({
    server: {
      baseDir: config.tasks.browserSync.server.baseDir
    }
  })
}

gulp.task('browserSync', browserSyncTask)
module.exports = browserSyncTask
