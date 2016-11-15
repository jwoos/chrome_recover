'use strict';

window.formsafe = window.formsafe || {};

function isVisible(elem) {
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
}

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

function storageSet(obj) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set(obj, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
				return;
			}

			resolve();
		});
	});
}

function storageGet(vals) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(vals, (items) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
				return;
			}

			resolve(items);
		});
	});
}

function debounce() {}

function throttle() {}

window.formsafe.utils = {
	debounce: debounce,
	throttle: throttle,
	getCurrentTabUrl: getCurrentTabUrl,
	isVisible: isVisible,
	storageSet: storageSet,
	storageGet: storageGet
};
