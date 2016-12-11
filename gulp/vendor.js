'use strict';

module.exports = (deps, config) => {
	const gulp         = deps.gulp;
	const fs           = deps.fs;
	const childProcess = deps.childProcess;

	gulp.task('vendor', () => {
		const paths = [
			'webcomponentsjs/webcomponents-lite.js'
		];

		return Promise.all([
			new Promise((resolve, reject) => {
				const writeStream = fs.createWriteStream('src/scripts/vendor/webcomponents-lite.js');
				writeStream.on('close', () => {
					resolve();
				});

				fs.createReadStream('bower_components/webcomponentsjs/webcomponents-lite.js').pipe(writeStream);

				setTimeout(() => {
					reject(new Error('Task timed out'));
				}, 2500);
			}),
			new Promise((resolve, reject) => {
				childProcess.exec('vulcanize --inline-scripts --strip-comments bower_components/polymer/polymer.html | crisper --html /dev/null --js src/scripts/vendor/polymer.js --only-split', (e) => {
					e ? reject(e) : resolve();
				});
			})
		]);
	});
};
