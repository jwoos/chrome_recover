'use strict';

module.exports = (deps, config) => {
	const gulp       = deps.gulp;
	const plumber    = deps.plumber;
	const sourcemaps = deps.sourcemaps;
	const sass       = deps.sass;

	gulp.task('css:srv', () => {
		return gulp.src(['./src/style/*.scss'])
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(sass({
				outputStyle: 'expanded'
			}).on('error', sass.logError))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./build/srv/style/'));
	});

	gulp.task('css:dist', () => {
		return gulp.src(['./src/style/*.scss'])
			.pipe(plumber())
			.pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(gulp.dest('./build/dist/style/'));
	});
};
