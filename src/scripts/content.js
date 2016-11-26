'use strict';

const utils = window.FORMSAFE.utils;

const visibleInputs = Array.from(document.querySelectorAll('input')).filter((elem) => {
	return utils.isVisible(elem) && (!elem.getAttribute('type') !== 'hidden');
});
const events = [];

const hostname = window.location.hostname;

const root = Object.create(null);

visibleInputs.forEach((elem, index) => {
	const fn = _.debounce(() => {
		const data = Object.create(null);
		root[hostname] = data;

		data['input-' + index] = elem.value || elem.getAttribute('value');

		utils.storageSet(root).then(() => {
			console.log('Success saving');
		}, (e) => {
			console.error('Error saving:', e);
		});

		utils.storageGet(null).then((items) => {
			console.log(items);
		});
	}, 1000);

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

utils.storageGet(null).then((items) => {
	console.log('storage:', items);
});
