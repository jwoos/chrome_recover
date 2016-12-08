'use strict';

window.FORMSAFE = window.FORMSAFE || {};

window.FORMSAFE.utils = {
	isVisible: (elem) => {
		if (!elem || !elem.nodeName) {
			return false;
		}

		const boundingRect = elem.getBoundingClientRect();
		const keys = [
			'bottom',
			'height',
			'left',
			'right',
			'top',
			'width'
		];

		for (let prop of keys) {
			if (boundingRect[prop]) {
				return true;
			}
		}

		return false;
	},

	getCurrentTabUrl: () => {
		return new Promise((resolve, reject) => {
			const queryInfo = {
				active: true,
				currentWindow: true
			};

			chrome.tabs.query(queryInfo, (tabs) => {
				const url = tabs[0].url;

				if (typeof url === 'string') {
					resolve(url);
				} else {
					reject('tab.url should be a string');
				}
			});
		});
	},

	storageSet: (obj) => {
		console.log('Attempting to save to local storage...');

		return new Promise((resolve, reject) => {
			chrome.storage.local.set(obj, () => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
			});
		});
	},

	storageGet: (vals) => {
		console.log('Attempting to get from local storage...');

		return new Promise((resolve, reject) => {
			chrome.storage.local.get(vals, (items) => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
			});
		});
	},

	storageRemove: (vals) => {
		console.log('Attempting to remove from local storage...');

		return new Promise((resolve, reject) => {
			chrome.storage.local.remove(vals, () => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
			});
		});
	},

	storageClear: () => {
		console.log('Attempting to clear storage...');

		return new Promise((resolve, reject) => {
			chrome.storage.local.clear(() => {
				chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
			});
		});
	},

	getDomain: (link) => {
		const re = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;
		const matches = link.match(re);

		return matches[1];
	},

	checkAttributes: (elem, config) => {
		let status = true;

		const attributes = Object.keys(config);

		for (let attr of attributes) {
			const blacklist = config[attr] || [];
			const elemAttr = elem.getAttribute(attr);

			if (blacklist.includes(elemAttr)) {
				status = false;
				break;
			}
		}

		return status;
	}
};
