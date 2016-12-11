'use strict';

module.exports = (deps, config) => {
	const gulp    = deps.gulp;
	const plumber = deps.plumber;
	const pug     = deps.pug;

	gulp.task('html:srv', () => {
		gulp.src(['./src/*.pug'])
			.pipe(plumber())
			.pipe(pug({
				pretty: '\t'
			}))
			.pipe(gulp.dest('./build/srv/'));
	});

	gulp.task('html:dist', () => {
		gulp.src(['./src/*.pug'])
			.pipe(plumber())
			.pipe(pug())
			.pipe(gulp.dest('./build/dist/'));
	});
};
