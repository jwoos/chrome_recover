import {InterfaceEventListener, InterfaceEventOptions, InterfaceVisibleFnConfig} from './interfaces';

import * as _ from 'lodash';
import * as rivets from 'rivets';

import * as utils from './utils';

domReady().then(() => {
	const body: HTMLElement = document.querySelector('body');

	utils.getCurrentTabUrl().then((url: string) => {
		document.querySelector('div').textContent = url;
	});

	utils.storageGet(null).then((data: Object) => {
		const hostnames: Array<string> = Object.keys(data);

		for (let hostname of hostnames) {
			const hostData: Object = data[hostname];
			const div = document.createElement('div');
			div.setAttribute('data-hostname', hostname);
			div.textContent = `hostname: ${hostname}\n` + JSON.stringify(hostData);

			// doesn't update properly
			div.addEventListener('click', () => {
				data[hostname] = null;

				console.log(data);

				utils.storageSet(data).then(() => {
					console.log(data);
					console.log('Deleted hostname!');
				});
			}, {
				capture: true,
				once: true,
				passive: true,
			});

			body.appendChild(div);
		}
	});
});
