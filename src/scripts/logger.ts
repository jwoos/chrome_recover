const logs: Array<Array<any>> = [];

export const log = (...args: Array<any>): void => {
	console.log('FORMSAFE [LOG]:', ...args);
	logs.push([new Date(), ...args]);
};

export const error = (...args: Array<any>): void => {
	console.error('FORMSAMFE [ERROR]:', ...args);
	logs.push([new Date(), ...args]);
};

export const warn = (...args: Array<any>): void => {
	console.warn('FORMSAMFE [WARNING]:', ...args);
	logs.push([new Date(), ...args]);
};

export const info = (...args: Array<any>): void => {
	console.info('FORMSAMFE [INFO]:', ...args);
	logs.push([new Date(), ...args]);
};

export const trace = (): void => {
	console.trace('FORMSAFE [TRACE]:');
};
