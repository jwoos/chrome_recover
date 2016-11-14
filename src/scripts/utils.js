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

window.formsafe.utils = {
	isVisible: isVisible
};
