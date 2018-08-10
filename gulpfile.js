var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var sourcemaps  = require("gulp-sourcemaps");
var fileinclude = require("gulp-file-include");

// File Paths
var SASS_PATH = "./src/sass/*.scss";

// Error Handling
var gulp_src = gulp.src;
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    })
  );
};

// Styles
gulp.task('styles', function() {
  return gulp.src('./src/sass/*.scss')
  .pipe(sass())
  .pipe(autoprefixer('last 2 versions'))
  .pipe(sourcemaps.init())
  .pipe(gulp.dest('./dist/css/'))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(concat("main.css", {newLine: ""}))
  .pipe(gulp.dest('./dist/css/'))
  .pipe(browserSync.reload({ stream: true }))
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
});

// File Include
gulp.task('fileinclude', function() {
  gulp.src(['./src/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './src/includes'
    }))
    .pipe(gulp.dest('./dist'));
});

// BrowserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    open: false,
    browser: "Google Chrome",
    notify: true,
    notify: {
        styles: {
            top: 'auto',
            bottom: '0',
            borderRadius: '4px 0 0 0',
            opacity: .9
        }
    },
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    }
  })
})

// Watch task
gulp.task('watch', ['browserSync'], function() {
  gulp.watch('./src/sass/*.scss', ['styles']);
  gulp.watch('./src/js/*.js', ['scripts']);
  gulp.watch('./src/includes/*.html', ['fileinclude']);
  gulp.watch('./dist/*.html', browserSync.reload);
});

gulp.task('default', ['styles', 'scripts', 'watch', 'fileinclude']);
