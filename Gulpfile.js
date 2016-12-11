'use strict';

const gulp = require('gulp');

const dependencies = {
	gulp: gulp,

	// node built ins
	childProcess: require('child_process'),
	fs: require('fs'),
	path: require('path'),

	atl: require('awesome-typescript-loader'),
	babel: require('gulp-babel'),
	colors: require('colors/safe'),
	del: require('del'),
	eslint: require('gulp-eslint'),
	imagemin: require('gulp-imagemin'),
	plumber: require('gulp-plumber'),
	pug: require('gulp-pug'),
	sass: require('gulp-sass'),
	sourcemaps: require('gulp-sourcemaps'),
	ts: require('gulp-typescript'),
	tslint: require('gulp-tslint'),
	webpack: require('webpack-stream'),
	wp: require('webpack'),
};

const config = {
	envs: ['srv', 'dist']
};

// Modular task registration
dependencies.fs.readdirSync('gulp').forEach((module) => {
	require(`./gulp/${module}`)(dependencies, config);
});

gulp.task('_srv', gulp.parallel('copy:srv', 'polybuild:srv', 'webpack:srv', 'css:srv', 'js:srv', 'ts:srv', 'images:srv', 'assets:srv'));
gulp.task('srv', gulp.series('init:srv', 'clean:srv', 'tslint', '_srv'));
gulp.task('default', gulp.series('srv'));

gulp.task('_dist', gulp.parallel('copy:dist', 'polybuild:dist', 'webpack:dist', 'css:dist', 'js:dist', 'ts:dist', 'images:dist', 'assets:dist'));
gulp.task('dist', gulp.series('init:dist', 'clean:dist', 'tslint', '_dist'));
