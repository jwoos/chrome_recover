import {InterfaceEventListener, InterfaceEventOptions, InterfaceVisibleFnConfig} from './interfaces';

export const domReady = (): Promise<void> => {
	return new Promise((resolve) => {
		document.addEventListener('DOMContentLoaded', () => {
			resolve();
		});
	});
};

export const isVisible = (elem: Element): boolean => {
	if (!elem || !elem.nodeName) {
		return false;
	}

	const boundingRect = elem.getBoundingClientRect();
	const keys: Array<string> = [
		'bottom',
		'height',
		'left',
		'right',
		'top',
		'width',
	];

	let visible: boolean = false;

	for (let prop of keys) {
		if (boundingRect[prop]) {
			visible = true;
		}
	}

	return visible;
};

export const getCurrentTabUrl = (): Promise<string> => {
	return new Promise((resolve, reject) => {
		const queryInfo = {
			active: true,
			currentWindow: true,
		};

		chrome.tabs.query(queryInfo, (tabs) => {
			const url: string = tabs[0].url;

			if (typeof url === 'string') {
				resolve(url);
			} else {
				reject('tab.url should be a string');
			}
		});
	});
};

export const storageSet = (obj: Object): Promise<void | Object> => {
	console.log('Attempting to save to local storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.set(obj, () => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};

export const storageGet = (vals: string | Array<string> | Object): Promise<Object> => {
	console.log('Attempting to get from local storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.get(vals, (items) => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(items);
		});
	});
};

export const storageRemove = (vals: Array<string>): Promise<void | Object> => {
	console.log('Attempting to remove from local storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.remove(vals, () => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};

export const storageClear = (): Promise<void | Object> => {
	console.log('Attempting to clear storage...');

	return new Promise((resolve, reject) => {
		chrome.storage.local.clear(() => {
			chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
		});
	});
};

export const getDomain = (link: string): string => {
	const re = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;
	const matches = link.match(re);

	return matches[1];
};

export const checkAttributes = (elem: Element, config): boolean => {
	let status: boolean = true;

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
};
