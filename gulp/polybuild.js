'use strict';

module.exports = (deps, config) => {
	const gulp         = deps.gulp;
	const childProcess = deps.childProcess;

	config.envs.forEach((env) => {
		gulp.task(`polybuild:${env}`, () => {
			return new Promise((resolve, reject) => {
				childProcess.exec(`scripts/build.sh all ${env}`, (e) => {
					e ? reject(e) : resolve();
				});
			});
		});
	});
};
