import {InterfaceEventListener, InterfaceEventOptions, InterfaceVisibleFnConfig} from './interfaces';

import * as _ from 'lodash';
import * as rivets from 'rivets';

import * as utils from './utils';

utils.domReady().then(() => {
	const body: HTMLElement = document.querySelector('body');
	const dataReady = [];

	let url: string;
	dataReady.push(
		utils.getCurrentTabUrl().then((queriedUrl: string) => {
			url = queriedUrl;
		}),
	);

	let texts: Array<Object | void> = [];
	dataReady.push(
		utils.storageGet(null).then((textData: Object) => {
			const hostnames: Array<string> = Object.keys(textData);

			for (let hostname of hostnames) {
				const hostData = {
					destroy: (ev: Event, view: View) => {
						textData[hostname] = null;

						utils.storageSet(textData).then(() => {
							console.log('deleted');
						});
					},
					domain: hostname,
					text: JSON.stringify(textData[hostname]),
				};

				texts.push(hostData);
			}
		}),
	);

	Promise.all(dataReady).then(() => {
		const rv: View = rivets.bind(body, {url, texts});
		console.log(rv);
	});
});
