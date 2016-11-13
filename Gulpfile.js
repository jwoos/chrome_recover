'use strict';

const gulp = require('gulp');

const childProcess = require('child_process');

const colors = require('colors/safe');
const del = require('del');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('clean:srv', () => {
	del(['tmp/**/*']);
});

gulp.task('clean:dist', () => {
	del(['dist/**/*']);
});

gulp.task('eslint', () => {
	gulp.src(['./src/scripts/**/*.js'])
		.pipe(plumber())
		.pipe(eslint({
			eslint: '.eslintrc.json'
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('assets:srv', () => {
	gulp.src('./src/assets/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/assets/'));
});

gulp.task('assets:dist', () => {
	gulp.src(['./src/assets/**/*', '!images/'])
		.pipe(plumber())
		.pipe(gulp.dest('./dist/assets/'));

	gulp.src('./src/assets/images/**/*')
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/assets/'));
});

gulp.task('css:srv', () => {
	gulp.src('./src/styles/main.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./tmp/styles/'));

	gulp.src('./styles/bootstrap.css')
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/styles/'));
});

gulp.task('css:dist', () => {
	gulp.src('./src/styles/main.scss')
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(gulp.dest('./dist/styles/'));

	gulp.src('./src/styles/bootstrap.css')
		.pipe(plumber())
		.pipe(gulp.dest('./dist/styles/'));
});

gulp.task('js:srv', () => {
	gulp.src('./src/scripts/**/*.js')
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/scripts/'));
});

// TODO switch to different minifier, no support for ES6
gulp.task('js:dist', () => {
	gulp.src('./src/scripts/**/*.js')
		.pipe(plumber())
		.pipe(minify({
			ext:{
				src:'.js',
				min:'.js'
			},
			noSource: true
		}))
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('copy:srv', () => {
	gulp.src(['./src/**/*', '!./src/styles/*.scss', '!./src/scripts/*.js'])
		.pipe(plumber())
		.pipe(gulp.dest('./tmp/'));
});

gulp.task('copy:dist', () => {
	gulp.src(['./src/**/*', '!./src/styles/*.scss', '!./src/scripts/*.js'])
		.pipe(plumber())
		.pipe(gulp.dest('./dist/'));
});

// TODO enable after gulp 4.0
//gulp.task('default', gulp.series('clean:srv', gulp.parallel('copy:srv', 'css:srv', 'js:srv', 'assets:srv')), () => {});
//gulp.task('srv', gulp.series('clean:srv', gulp.parallel('copy:srv', 'css:srv', 'js:srv', 'assets:srv')), () => {});
gulp.task('default', ['copy:srv', 'css:srv', 'js:srv', 'assets:srv'], () => {});
gulp.task('srv', ['copy:srv', 'css:srv', 'js:srv', 'assets:srv'], () => {});

//gulp.task('dist', gulp.series('clean:dist', gulp.parallel('copy:dist', 'css:dist', 'js:dist', 'assets:dist')), () => {});
gulp.task('dist', ['copy:dist', 'css:dist', 'js:dist', 'assets:dist'], () => {});
