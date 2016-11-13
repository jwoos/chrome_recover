'use strict';

const childProcess = require('child_process');

const gulp = require('gulp');

const colors = require('colors/safe');
const del = require('del');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('clean:srv', () => {
	del(['tmp/**/*']);
});

gulp.task('clean:dist', () => {
	del(['dist/**/*']);
});

gulp.task('eslint', () => {
	gulp.src(['./src/scripts/*.js'])
		.pipe(plumber())
		.pipe(eslint({
			eslint: '.eslintrc.json'
		}))
		.pipe(eslint.format());
});

gulp.task('assets:srv', () => {
	gulp.src(['./src/assets/**/*'])
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/assets/'));
});

gulp.task('assets:dist', () => {
	gulp.src(['./src/assets/**/*', '!images/'])
		.pipe(plumber())
		.pipe(gulp.dest('./dist/assets/'));

	gulp.src(['./src/assets/images/**/*'])
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/assets/'));
});

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

gulp.task('css:srv', () => {
	gulp.src(['./src/style/**/*.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./tmp/style/'));
});

gulp.task('css:dist', () => {
	gulp.src(['./src/style/**/*.scss'])
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(gulp.dest('./dist/style/'));
});

gulp.task('js:srv', () => {
	gulp.src(['./src/scripts/**/*.js'])
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/scripts/'));
});

// TODO get rid of comments
gulp.task('js:dist', () => {
	gulp.src(['./src/scripts/**/*.js'])
		.pipe(plumber())
		.pipe(babel({
			presets: ['babili']
		}))
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('copy:srv', () => {
	gulp.src(['./manifest.json'])
		 .pipe(plumber())
		 .pipe(gulp.dest('./tmp/'));
 });

 gulp.task('copy:dist', () => {
	gulp.src(['./manifest.json'])
		 .pipe(plumber())
		 .pipe(gulp.dest('./dist/'));
 });

// TODO enable after gulp 4.0
//gulp.task('default', gulp.series('clean:srv', gulp.parallel('html:srv', 'css:srv', 'js:srv', 'assets:srv')), () => {});
gulp.task('srv', ['copy:srv', 'html:srv', 'css:srv', 'eslint', 'js:srv', 'assets:srv'], () => {});
gulp.task('default', ['srv'], () => {});

//gulp.task('dist', gulp.series('clean:dist', gulp.parallel('html:dist', 'css:dist', 'js:dist', 'assets:dist')), () => {});
gulp.task('dist', ['copy:dist', 'html:dist', 'css:dist', 'js:dist', 'assets:dist'], () => {});
