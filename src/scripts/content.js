'use strict';

const utils = window.FORMSAFE.utils;

const visibleInputs = Array.from(document.querySelectorAll('input')).filter((elem) => {
	return utils.isVisible(elem) && (!elem.getAttribute('type') !== 'hidden');
});
const events = [];

const hostname = window.location.hostname;

visibleInputs.forEach((elem, index) => {
	const fn = _.debounce(() => {
		const root = Object.create(null);

		utils.storageGet([hostname]).then((data) => {
			root[hostname] = data[hostname] || Object.create(null);
			root[hostname]['input-' + index] = elem.value || elem.getAttribute('value');

			return utils.storageSet(root);
		}).then(() => {
			console.log('saved');

			utils.storageGet(null).then((d) => {
				console.log(d);
			});
		}).catch((e) =>{
			console.log(e);
		});
	}, 750);

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
