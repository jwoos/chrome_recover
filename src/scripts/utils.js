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
	console.log('Attempting to save to local storage...');

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
	console.log('Attempting to get from local storage...');

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

function storageRemove(vals) {
	console.log('Attempting to remove from local storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.remove(vals, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
				return;
			}

			resolve();
		});
	});
}

function storageClear() {
	console.log('Attempting to clear storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.clear(() => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
				return;
			}

			resolve();
		});
	});
}

window.formsafe.utils = {
	getCurrentTabUrl: getCurrentTabUrl,
	isVisible: isVisible,
	storageSet: storageSet,
	storageGet: storageGet,
	storageRemove: storageRemove,
	storageClear: storageClear
};
