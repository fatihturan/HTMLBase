// Use Gulp Packages
var config        = require('./config');
var gulp          = require('gulp');
var glp           = require('gulp-load-plugins');
var $             = glp(config.gulpLoadConfig);
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;
var runSequence   = require("run-sequence");
var del           = require('del');


// Error Handling
var gulp_src = gulp.src;
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe($.plumber(function(error) {
      // Output an error message
      $.util.log($.util.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    })
  );
};

// Styles
gulp.task('styles', function() {
  return gulp.src(config.css.src)
    .pipe($.sass({
      includePaths: ['node_modules']
    }))
    .pipe($.autoprefixer('last 2 versions'))
    .pipe($.sourcemaps.init())
    .pipe(gulp.dest(config.css.dist))
    .pipe($.clean())
    .pipe($.sourcemaps.write())
    .pipe($.csso())
    .pipe($.cssnano({
      discardComments: {removeAll: true},
      zindex: false
    }))
    .pipe(gulp.dest(config.css.dist))
    .pipe(reload({stream:true}))
});

//  File Include
gulp.task('fileinclude', function () {
  return gulp.src(config.html.src)
    .pipe($.include({
      prefix: '@@',
      basepath: 'src/includes'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream:true}))
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src([].concat(config.js.src, config.plugins))
    .pipe($.uglify())
    .pipe($.concat('main.min.js'))
    .pipe(gulp.dest(config.js.dist))
    .pipe(reload({stream:true}))
});

gulp.task('images', function () {
  return gulp.src(config.images.src)
    .pipe($.imagemin())
    .pipe(gulp.dest(config.images.dist));
});

// BrowserSync
gulp.task('serve', function() {
  browserSync(config.browserSync);

  gulp.task('styles:watch', ['styles']);
  gulp.watch(config.css.src, ['styles:watch']);

  gulp.task('scripts:watch', ['scripts']);
  gulp.watch(config.js.src, ['scripts:watch']);

  gulp.task('images:watch', ['images']);
  gulp.watch(config.images.src, ['images:watch']);

  gulp.task('fileinclude:watch', ['fileinclude']);
  gulp.watch([config.html.src, config.include], ['fileinclude:watch']);
})

gulp.task('clean', function (cb) {
  del(['dist']).then(() => cb());
});

gulp.task('default', ['clean'], function () {
  var tasks = [
    'fileinclude',
    'styles',
    'scripts',
    'images'
  ];

  runSequence(tasks, function () {
      gulp.start('serve');
  });
});
