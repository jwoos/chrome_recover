import {InterfaceEventListener, InterfaceEventOptions, InterfaceVisibleFnConfig} from './interfaces';

import * as _ from 'lodash';
import * as utils from './utils';

const visibleInputs = Array.from(document.querySelectorAll('input')).filter((elem) => {
	const config = {
		type: ['hidden', 'password', 'radio', 'file', 'reset', 'button'],
	};

	return utils.isVisible(elem) && utils.checkAttributes(elem, config);
});

const visibleTextAreas: Array<HTMLElement> = Array.from(document.querySelectorAll('textarea')).filter((elem: HTMLElement): boolean => {
	const config = {
		readonly: ['', 'true'],
	};

	return utils.isVisible(elem) && utils.checkAttributes(elem, config);
});

const visibleEditableElements: Array<HTMLElement> = Array.from(<NodeListOf<HTMLElement>>document.querySelectorAll('div[contenteditable]')).filter((elem: HTMLElement): boolean => {
	const config = {
		contenteditable: [null, 'false'],
	};

	return utils.isVisible(elem) && utils.checkAttributes(elem, config);
});

const allForms: Array<HTMLElement> = Array.prototype.concat(visibleInputs, visibleTextAreas, visibleEditableElements);

const events: Array<InterfaceEventListener> = [];

const hostname: string = window.location.hostname;

allForms.forEach((elem: HTMLInputElement, index: number) => {
	const fn = _.debounce(() => {
		const root = Object.create(null);

		utils.storageGet([hostname]).then((data) => {
			root[hostname] = data[hostname] || Object.create(null);
			root[hostname]['form-' + index] = elem.isContentEditable ? elem.textContent : elem.value || elem.getAttribute('value');

			return utils.storageSet(root);
		}).then(() => {
			console.log('saved');
		}).catch((e) => {
			console.log(e);
		});
	}, 750);

	const options: InterfaceEventOptions = {
		capture: true,
		usePassive: true,
	};

	const eventType: string = 'input';

	elem.addEventListener(eventType, fn, options);

	const tracker = Object.create(null);
	tracker.fn = fn;
	tracker.eventType = eventType;
	tracker.options = options;

	events.push(tracker);
});

utils.storageGet(null).then((items) => {
	console.log('storage:', items);
});

// utils.storageClear();
