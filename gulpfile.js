var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css');

gulp.task('default', ['jshint', 'build-css', 'build-js'], function() {
  return gutil.log('All tasks are DONE!');
});

gulp.task('jshint', function() {
  return gulp.src('src/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(concat('styles.css'))
      .pipe(gutil.env.type === 'production' ? cleanCSS() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('build-js', function() {
  return gulp.src('src/javascript/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/javascript'));
});

gulp.task('watch', function() {
  gulp.watch('src/javascript/**/*.js', ['jshint']);
  gulp.watch('src/scss/**/*.scss', ['build-css']);
  gulp.watch('src/javascript/**/*.js', ['build-js']);
});
