'use strict';

window.formsafe = window.formsafe || {};

function getCurrentTabUrl() {
	return new Promise((resolve, reject) => {
		let queryInfo = {
			active: true,
			currentWindow: true
		};

		chrome.tabs.query(queryInfo, (tabs) => {
			let tab = tabs[0];

			let url = tab.url;

			if (typeof url === 'string') {
				resolve(url);
			} else {
				reject('tab.url should be a string');
			}
		});
	});
}

window.formsafe.popupUtils = {
	getCurrentTabUrl: getCurrentTabUrl
};
