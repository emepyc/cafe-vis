/*
 * tnt.newick
 * https://github.com/emepyc/tnt.newick
 *
 * Copyright (c) 2014 Miguel Pignatelli
 * Licensed under the Apache 2 license.
 */

var gulp   = require('gulp');
var jshint = require("gulp-jshint");
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');

// gulp helper
var del = require('del');
var rename = require('gulp-rename');

// path tools
var path = require('path');
var join = path.join;
var mkdirp = require('mkdirp');

// browserify build config
var buildDir = "build";
var browserFile = "index.js";
var packageConfig = require('./package.json');
var outputFile = packageConfig.name;

// auto config for browserify
var outputFileSt = outputFile + ".js";
var outputFilePath = join(buildDir,outputFileSt);
var outputFileMinSt = outputFile + ".min.js";
var outputFileMin = join(buildDir,outputFileMinSt);

// a failing test breaks the whole build chain
gulp.task('default', ['lint', 'build-browser']);


gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
   gulp.watch(['./src/**/*.js','./lib/**/*.js', './test/**/*.js'], function() {
     gulp.run('test');
   });
});

// will remove everything in build
gulp.task('clean', function (cb) {
    del ([buildDir], cb);
});

// just makes sure that the build dir exists
gulp.task('init', ['clean'], function() {
  mkdirp(buildDir, function (err) {
    if (err) console.error(err);
  });
});

// browserify debug
gulp.task('build-browser',['init'], function() {
  return gulp.src(browserFile)
  .pipe(browserify({debug:true}))
  .pipe(rename(outputFileSt))
  .pipe(gulp.dest(buildDir));
});

// browserify min
gulp.task('build-browser-min',['init'], function() {
  return gulp.src(browserFile)
  .pipe(browserify({}))
  .pipe(uglify())
  .pipe(rename(outputFileMinSt))
  .pipe(gulp.dest(buildDir));
});
