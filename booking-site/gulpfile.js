const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');

sass.compiler = require('node-sass');

const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');

// Sass compilation
gulp.task('sass', function() {
  return gulp
    .src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

// Sass watching, depending on "sass" task
gulp.task('sass:watch', function() {
  gulp.watch('./sass/**/*.scss', gulp.series('sass'));
});

// Nodemon task:
// Start nodemon once and execute callback (browser-sync)
gulp.task('nodemon', cb => {
  let started = false;
  return nodemon({
    script: 'server.js'
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});

// BrowserSync task:
// calls nodemon tasks and pass itself as callback
gulp.task(
  'browser-sync',
  gulp.series('nodemon', () => {
    browserSync.init(null, {
      proxy: 'http://localhost:3000',
      files: ['./sass/**/*.scss', './*.js', './js/**/*.js', './views/**/*.pug'],
      port: 5000
    });
  })
);

// Pug Compilation
gulp.task('pug', () => {
  return gulp
  .src('./views/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('./'))
})

// Pug watching, depending on "pug" task
gulp.task('pug:watch', function() {
  gulp.watch('./views/**/*.pug', gulp.series('pug'))
})

// Dev Task: 
// Parallel execution of browser-sync/nodemon
// Sass watching
// and Pug watching
gulp.task('default', gulp.parallel('browser-sync', 'sass:watch', 'pug:watch'));