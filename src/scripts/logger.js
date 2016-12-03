'use strict';

window.FORMSAFE = window.FORMSAFE || {};

window.FORMSAFE.logs = [];

function log(...args) {
	console.log('FORMSAFE [LOG]:', ...args);
	window.FORMSAFE.logs.push([new Date(), ...args]);
}

function error(...args) {
	console.error('FORMSAMFE [ERROR]:', ...args);
	window.FORMSAFE.logs.push([new Date(), ...args]);
}

function warn(...args) {
	console.warn('FORMSAMFE [WARNING]:', ...args);
	window.FORMSAFE.logs.push([new Date(), ...args]);
}

function info(...args) {
	console.info('FORMSAMFE [INFO]:', ...args);
	window.FORMSAFE.logs.push([new Date(), ...args]);
}

function trace() {
	console.trace('FORMSAFE [TRACE]:');
}

function memory() {
	console.log(console.memory);
}

window.FORMSAFE.logger = {
	log: log,
	warn: warn,
	error: error,
	info: info,
	trace: trace,
	memory: memory
};
