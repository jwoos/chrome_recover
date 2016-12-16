'use strict';

module.exports = (deps, config) => {
	const gulp    = deps.gulp;
	const plumber = deps.plumber;
	const pug     = deps.pug;

	config.envs.forEach((env) => {
		return gulp.task(`html:${env}`, () => {
			return gulp.src(['./src/*.html'])
				.pipe(plumber())
				.pipe(gulp.dest(`./build/${env}/`));
		});
	});

	gulp.task('pug:srv', () => {
		return gulp.src(['./src/*.pug'])
			.pipe(plumber())
			.pipe(pug({
				pretty: '\t'
			}))
			.pipe(gulp.dest('./build/srv/'));
	});

	gulp.task('pug:dist', () => {
		return gulp.src(['./src/*.pug'])
			.pipe(plumber())
			.pipe(pug())
			.pipe(gulp.dest('./build/dist/'));
	});
};
