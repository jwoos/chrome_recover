'use strict';

const childProcess = require('child_process');

const gulp = require('gulp');

const babel = require('gulp-babel');
const colors = require('colors/safe');
const del = require('del');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('init:srv', () => {
	return new Promise((resolve, reject) => {
		childProcess.exec('if [ ! -d tmp ]; then mkdir tmp; fi', (e) => {
			e ? reject() : resolve();
		});
	});
});

gulp.task('init:dist', () => {
	return new Promise((resolve, reject) => {
		childProcess.exec('if [ ! -d dist ]; then mkdir dist; fi', (e) => {
			e ? reject() : resolve();
		});
	});
});

gulp.task('clean:srv', () => {
	return del(['tmp/**/*']);
});

gulp.task('clean:dist', () => {
	return del(['dist/**/*']);
});

gulp.task('eslint', () => {
	return gulp.src(['./src/scripts/*.js'])
		.pipe(plumber())
		.pipe(eslint({
			eslint: '.eslintrc.json'
		}))
		.pipe(eslint.format());
});

gulp.task('assets:srv', () => {
	return gulp.src(['./src/assets/**/*', '!images/'])
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/assets/'));
});

gulp.task('assets:dist', () => {
	return gulp.src(['./src/assets/**/*', '!images/'])
		.pipe(plumber())
		.pipe(gulp.dest('./dist/assets/'));
});

gulp.task('images:srv', () => {
	return gulp.src(['./src/assets/images/**/*'])
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/assets/'));
});

gulp.task('images:dist', () => {
	return gulp.src(['./src/assets/images/**/*'])
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/assets/'));
});

gulp.task('polybuild:srv', () => {
	return new Promise((resolve, reject) => {
		childProcess.exec('scripts/build.sh all srv', (e) => {
			e ? reject(e) : resolve();
		});
	});
});

// TODO minify compiled js
gulp.task('polybuild:dist', () => {
	return new Promise((resolve, reject) => {
		childProcess.exec('scripts/build.sh all dist', (e) => {
			e ? reject(e) : resolve();
		});
	});
});

gulp.task('js:srv', () => {
	return gulp.src(['./src/scripts/**/*.js'])
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/scripts/'));
});

// TODO get rid of comments
gulp.task('js:dist', () => {
	return gulp.src(['./src/scripts/**/*.js'])
		.pipe(plumber())
		.pipe(babel({
			presets: ['babili']
		}))
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('css:srv', () => {
	return gulp.src(['./src/style/*.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./tmp/style/'));
});

gulp.task('css:dist', () => {
	return gulp.src(['./src/style/*.scss'])
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(gulp.dest('./dist/style/'));
});

gulp.task('copy:srv', () => {
	return gulp.src(['./manifest.json'])
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/'));
});

gulp.task('copy:dist', () => {
	return gulp.src(['./manifest.json'])
		.pipe(plumber())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('_srv', gulp.parallel('copy:srv', 'polybuild:srv', 'css:srv', 'js:srv', 'images:srv', 'assets:srv'));
gulp.task('srv', gulp.series('init:srv', 'clean:srv', 'eslint', '_srv'));
gulp.task('default', gulp.series('srv'));

gulp.task('_dist', gulp.parallel('copy:dist', 'polybuild:dist', 'css:dist', 'js:dist', 'images:dist', 'assets:dist'));
gulp.task('dist', gulp.series('init:dist', 'clean:dist', 'eslint', '_dist'));

// TODO html minifier
// TODO js minifier for polybuild code

/*
 * DEPRECATED
 */
gulp.task('html:srv', () => {
	gulp.src(['./src/*.pug'])
		.pipe(plumber())
		.pipe(pug({
			pretty: '\t'
		}))
		.pipe(gulp.dest('./tmp/'));
});

gulp.task('html:dist', () => {
	gulp.src(['./src/*.pug'])
		.pipe(plumber())
		.pipe(pug())
		.pipe(gulp.dest('./dist/'));
});
