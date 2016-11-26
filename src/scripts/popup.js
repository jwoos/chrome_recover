'use strict';

const utils = window.FORMSAFE.utils;

document.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');

	utils.getCurrentTabUrl().then((url) => {
		document.querySelector('div').textContent = url;
	});

	utils.storageGet(null).then((data) => {
		const hostnames = Object.keys(data);

		for (let i = 0; i < hostnames.length; i++) {
			const hostname = hostnames[i];
			const hostData = data[hostname];
			const div = document.createElement('div');
			div.setAttribute('data-hostname', hostname);
			div.textContent = `hostname: ${hostname}\n` + JSON.stringify(hostData);

			// doesn't update properly
			div.addEventListener('click', () => {
				delete data[hostname];

				utils.storageSet(data).then(() => {
					console.log(data);
					console.log('Deleted hostname!');
				});
			}, {
				passive: true,
				capture: true,
				once: true
			});

			body.append(div);
		}
	});
});
