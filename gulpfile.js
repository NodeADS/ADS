var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var stream = require('webpack-stream');
var webpackConfig = require("./webpack.config.js");
var server = require('gulp-express');

gulp.task('webpack', function() {
  return gulp.src('pulbic/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(stream(webpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('bin'));
});

gulp.task('server', function() {
  server.run(['server.js']);
});

gulp.task('default', ['server', 'webpack']);
