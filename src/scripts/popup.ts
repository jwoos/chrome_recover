import * as interfaces from './interfaces';

import * as _ from 'lodash';
import * as rivets from 'rivets';

import * as utils from './utils';

utils.domReady().then(() => {
	const rivetsConfig: interfaces.InterfaceRivetsConfig = {
		executeFunctions: false,
		// TODO figure out how to use arrow function
		handler: function(target, event, binding) {
			this.call(target, event, binding.view.models, target);
		},
		iterationAlias: (modelName: string): string => `%${modelName}%`,
		prefix: 'rv',
		preloadData: true,
		rootInterface: '.',
		templateDelimiters: '{}'.split(''),
	};

	rivets.configure(rivetsConfig);

	const body: HTMLElement = document.querySelector('body');

	let fullData: Object = {};
	let hostname: string;
	const fields: Array<Object> = [];

	const dataReady = [
		utils.getCurrentTabUrl().then((queriedUrl: string) => {
			hostname = utils.getDomain(queriedUrl);
		}),
		utils.storageGet(null).then((textData: Object) => {
			fullData = textData;

			const domainData: Object = textData[hostname] || {};
			const fieldKeys: Array<string> = Object.keys(domainData);

			for (let fk of fieldKeys) {
				const temp = {
					destroy: (ev: Event, view: View, target: HTMLElement) => {
						delete domainData[fk];

						// does the fields array have to be updated?
						utils.storageSet(fullData).then(() => {
							target.remove();
						});
					},
					key: fk,
					text: domainData[fk],
				};

				fields.push(temp);
			}
		}),
	];

	Promise.all(dataReady).then(() => {
		const rv: View = rivets.bind(body, {hostname, fields});
	});
});
