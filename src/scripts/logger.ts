'use strict';

window.FORMSAFE = window.FORMSAFE || {};

window.FORMSAFE.logs = [];

/* eslint-disable no-console */
window.FORMSAFE.logger = {
	log: (...args) => {
		console.log('FORMSAFE [LOG]:', ...args);
		window.FORMSAFE.logs.push([new Date(), ...args]);
	},

	error: (...args) => {
		console.error('FORMSAMFE [ERROR]:', ...args);
		window.FORMSAFE.logs.push([new Date(), ...args]);
	},

	warn: (...args) => {
		console.warn('FORMSAMFE [WARNING]:', ...args);
		window.FORMSAFE.logs.push([new Date(), ...args]);
	},

	info: (...args) => {
		console.info('FORMSAMFE [INFO]:', ...args);
		window.FORMSAFE.logs.push([new Date(), ...args]);
	},

	trace: () => {
		console.trace('FORMSAFE [TRACE]:');
	},

	memory: () => {
		console.log(console.memory);
	}
};
/* eslint-enable no-console */
