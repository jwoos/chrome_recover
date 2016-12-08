import * as _ from 'lodash';
import * as utils from './utils';

const visibleInputs = Array.from(document.querySelectorAll('input')).filter((elem) => {
	const config = {
		type: ['hidden', 'password', 'radio', 'file', 'reset', 'button'],
	};

	return utils.isVisible(elem) && utils.checkAttributes(elem, config);
});

const visibleTextAreas = Array.from(document.querySelectorAll('textarea')).filter((elem) => {
	const config = {
		readonly: ['', 'true'],
	};

	return utils.isVisible(elem) && utils.checkAttributes(elem, config);
});

const visibleEditableElements = Array.from(document.querySelectorAll('div[contenteditable]')).filter((elem) => {
	const config = {
		contenteditable: [null, 'false'],
	};

	return utils.isVisible(elem) && utils.checkAttributes(elem, config);
});

const allForms = Array.prototype.concat(visibleInputs, visibleTextAreas, visibleEditableElements);

const events = [];

const hostname = window.location.hostname;

allForms.forEach((elem, index) => {
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

	const options = {
		capture: true,
		usePassive: true,
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

// utils.storageClear();
