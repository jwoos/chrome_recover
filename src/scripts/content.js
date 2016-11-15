'use strict';

const utils = window.formsafe.utils;

const storage = chrome.storage.local;

const visibleInputs = Array.from(document.querySelectorAll('input')).filter((elem) => {
	return utils.isVisible(elem) && (!elem.getAttribute('type') !== 'hidden');
});
const events = [];

visibleInputs.forEach((elem, index) => {
	const fn = () => {
		const data = Object.creat(null);
		data['input-' + index] = elem.getAttribute('value');

		utils.storageSet(data).then(() => {
			console.log('Success saving');
		}, (e) => {
			console.error('Error saving:', e);
		});
	};

	const options = {
		usePassive: true,
		capture: true
	};

	const type = 'input';

	elem.addEventListener(type, fn, options);

	const tracker = Object.create(null);
	tracker.fn = fn;
	tracker.type = type;
	tracker.options = options;

	events.push(tracker);
});

console.log(events);
