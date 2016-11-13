'use strict';

function getCurrentTabUrl() {
	return new Promise((resolve, reject) => {
		let queryInfo = {
			active: true,
			currentWindow: true
		};

		chrome.tabs.query(queryInfo, (tabs) => {
			let tab = tabs[0];

			let url = tab.url;

			console.assert(typeof url == 'string', 'tab.url should be a string');

			resolve(url);
		});
	});
}
