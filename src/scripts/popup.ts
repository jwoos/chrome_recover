import * as _ from 'lodash';
import * as utils from './utils';

document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');

	utils.getCurrentTabUrl().then((url) => {
		document.querySelector('div').textContent = url;
	});

	utils.storageGet(null).then((data) => {
		const hostnames = Object.keys(data);

		for (let hostname of hostnames) {
			const hostData = data[hostname];
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
