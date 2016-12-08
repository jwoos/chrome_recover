'use strict';

const gulp = require('gulp');

const childProcess = require('child_process');
const fs           = require('fs');
const path         = require('path');

const atl        = require('awesome-typescript-loader');
const babel      = require('gulp-babel');
const colors     = require('colors/safe');
const del        = require('del');
const eslint     = require('gulp-eslint');
const imagemin   = require('gulp-imagemin');
const plumber    = require('gulp-plumber');
const pug        = require('gulp-pug');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const ts         = require('gulp-typescript');
const tslint     = require('gulp-tslint');
const webpack    = require('webpack-stream');
const wp         = require('webpack');

const tsProject     = ts.createProject('tsconfig.json');
const tsPathsPlugin = atl.TsConfigPathsPlugin;

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

gulp.task('tslint', () => {
	return gulp.src(['./src/**/*.ts'])
		.pipe(plumber())
		.pipe(tslint({
			formatter: 'verbose'
		}))
		.pipe(tslint.report({
			emitError: false
		}));
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

gulp.task('ts:srv', () => {
	return gulp.src(['./src/scripts/**/*.ts'])
		.pipe(plumber())
		.pipe(tsProject())
		.js.pipe(gulp.dest('./tmp/scripts/'));
});

gulp.task('ts:dist', () => {
	return gulp.src(['./src/scripts/**/*.js'])
		.pipe(plumber())
		.pipe(tsProject())
		.js.pipe(babel({
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

gulp.task('webpack:srv', () => {
	return gulp.src(['./src/scripts/*.ts'])
		.pipe(plumber())
		.pipe(webpack({
			entry: {
				'content': './src/scripts/content.ts',
				'options': './src/scripts/options.ts',
				'popup': './src/scripts/popup.ts'
			},
			context: path.resolve(__dirname),
			devtool: 'source-map',
			resolve: {
				extensions: ['.js', '.ts'],
				modules: [path.resolve(__dirname, 'src'), 'node_modules']
			},
			resolveLoader: {
				modules: ['node_modules']
			},
			output: {
				filename: '[name].js'
			},
			target: 'web',
			module: {
				rules: [
					{
						test: /\.json$/,
						use: 'json-loader'
					},
					{
						test: /\.ts$/,
						use: 'awesome-typescript-loader'
					},
					{
						test: /\.js$/,
						use: [
							{
								loader: 'babel-loader',
								options: {
									presets: ['babili'],
									cacheDirectory: ['.tmp/babel/']
								}
							}
						],
						exclude: /(node_modules|bower_components)/
					}
				]
			},
			plugins: [
				new tsPathsPlugin(),
				new wp.LoaderOptionsPlugin({
					minimize: true,
					debug: false
				})
			],
			stats: {
				//assets: false,
				//assetsSort: "field",
				cached: true,
				children: true,
				chunks: true,
				chunkModules: true,
				chunkOrigins: true,
				//chunksSort: "field",
				//context: "../src/",
				errors: true,
				errorDetails: true,
				hash: true,
				modules: true,
				//modulesSort: "field",
				//publicPath: true,
				reasons: true,
				source: true,
				timings: true,
				version: true,
				warnings: true
			}
		}, wp))
		.pipe(gulp.dest('./tmp/scripts/'));
});

gulp.task('webpack:dist', () => {
	return gulp.src(['./src/scripts/*.ts'])
		.pipe(plumber())
		.pipe(webpack({
			entry: {
				'content': './src/scripts/content.ts',
				'options': './src/scripts/options.ts',
				'popup': './src/scripts/popup.ts'
			},
			context: path.resolve(__dirname),
			devtool: false,
			resolve: {
				extensions: ['.js', '.ts'],
				modules: [path.resolve(__dirname, 'src'), 'node_modules']
			},
			resolveLoader: {
				modules: ['node_modules']
			},
			output: {
				filename: '[name].js'
			},
			target: 'web',
			module: {
				rules: [
					{
						test: /\.json$/,
						use: 'json-loader'
					},
					{
						test: /\.ts$/,
						use: 'awesome-typescript-loader'
					},
					{
						test: /\.js$/,
						use: [
							{
								loader: 'babel-loader',
								options: {
									presets: ['babili'],
									cacheDirectory: ['.tmp/babel/']
								}
							}
						],
						exclude: /(node_modules|bower_components)/
					}
				]
			},
			plugins: [
				new tsPathsPlugin(),
				new wp.LoaderOptionsPlugin({
					minimize: true,
					debug: false
				})
			],
			stats: {
				//assets: false,
				//assetsSort: "field",
				cached: true,
				children: true,
				chunks: true,
				chunkModules: true,
				chunkOrigins: true,
				//chunksSort: "field",
				//context: "../src/",
				errors: true,
				errorDetails: true,
				hash: true,
				modules: true,
				//modulesSort: "field",
				//publicPath: true,
				reasons: true,
				source: true,
				timings: true,
				version: true,
				warnings: true
			}
		}, wp))
		.pipe(babel({
			presets: ['babili']
		}))
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('_srv', gulp.parallel('copy:srv', 'polybuild:srv', 'webpack:srv', 'css:srv', 'js:srv', 'ts:srv', 'images:srv', 'assets:srv'));
gulp.task('srv', gulp.series('init:srv', 'clean:srv', 'tslint', '_srv'));
gulp.task('default', gulp.series('srv'));

gulp.task('_dist', gulp.parallel('copy:dist', 'polybuild:dist', 'webpack:dist', 'css:dist', 'js:dist', 'ts:dist', 'images:dist', 'assets:dist'));
gulp.task('dist', gulp.series('init:dist', 'clean:dist', 'tslint', '_dist'));

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

gulp.task('eslint', () => {
	return gulp.src(['./src/scripts/*.js'])
		.pipe(plumber())
		.pipe(eslint({
			eslint: '.eslintrc.json'
		}))
		.pipe(eslint.format());
});
