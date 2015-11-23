var source = require('vinyl-source-stream');
var requireDir = require('require-dir');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');

var gulp = require('gulp');
var gutil = require('gulp-util');
var fileinclude	= require('gulp-file-include');
var notify = require('gulp-notify');
var cmq = require('gulp-combine-media-queries');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var markdown = require('gulp-markdown');

var reload = browserSync.reload;

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}


/*
	'browser-sync'
*/

gulp.task('browser-sync', function() {
	browserSync({
		server: {baseDir: './dist/'},
		middleware : [ historyApiFallback() ],
    ghostMode: false
	});
});


/*
	'styles'
*/

gulp.task('styles', function () {
	gulp.src('_css/fonts/**.*')
		.pipe(gulp.dest('./dist/css/fonts'))

	gulp.src('_css/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cmq())
    .pipe(minifyCSS({keepSpecialComments: '0'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css/'))
		.pipe(reload({stream:true}));
});


/*
	'markdown'
*/

gulp.task('markdown', function() {
	gulp.src('_md/**/**.md')
    .on('error', handleErrors)
		.pipe(markdown())
		.pipe(rename({
	    prefix: '_'
	  }))
		.pipe(gulp.dest('_html/texts/'))
		.pipe(reload({stream:true}));
});


/*
	'html'
*/

gulp.task('html', ['markdown'], function() {
	gulp.src(['_html/**/**/*.html'])
    .on('error', handleErrors)
		.pipe(fileinclude())
		.pipe(gulp.dest('./dist/'))
		.pipe(reload({stream:true}));
});


/*
	'images'
*/

gulp.task('images', function() {
	gulp.src('_img/*.{png,jpeg,jpg,gif,svg}')
    .on('error', handleErrors)
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/images'))
    .pipe(reload({stream:true}));
});


/*
	'scripts'
*/

function buildScript(file, watch) {
  var props = {
    entries: ['./_js/' + file],
    debug : true,
    transform:  [babelify.configure({presets: ['stage-0','es2015'] })]
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./dist/js/'))
      // If you also want to uglify it
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename('main.min.js'))
      .pipe(gulp.dest('./dist/js/'))
      .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('scripts', function() {
  return buildScript('main.js', false); // this will run once because we set watch to false
});


/*
	'watch'
*/

gulp.task('default', ['markdown', 'html', 'images', 'styles', 'scripts', 'browser-sync'], function() {
	gulp.watch('_md/**/**/**/*', ['markdown']);
  gulp.watch('_html/**/**/**/*', ['html']);
  gulp.watch('_img/**/**/**/*', ['images']);
  gulp.watch('_css/**/**/**/*', ['styles']);
  return buildScript('main.js', true); // browserify watch for JS changes
});

